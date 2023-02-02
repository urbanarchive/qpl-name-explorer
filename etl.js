#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const core = require('@actions/core');

const AIRTABLE = {
  domain: 'https://api.airtable.com',
  returnFieldsByFieldId: true,
  key: process.env.AIRTABLE_API_KEY,
};
const LOCATIONS = {
  path: '/v0/appS1fzGsI76K6IPO/Collections Metadata',
  view: 'U/A view',
  filterByFormula: '{Ready for U/A}=1',
  returnFieldsByFieldId: true,
  // SEE src/models/monument.js

  PLACE_NAME: 'fld3zcPVX14gMRFd1',
  COORDS: 'fld03C27tmVnEg1rP',
  TYPE: 'fldb2kOoaaol8IIiQ',
  IMAGES: 'fldchc6j0XRMy0vb9',
  DESCRIPTION: 'fld18VKjlf9BGaE9N',
  SUBMITTED_AT: 'fld63z0I0JEzkE26Z',
  IS_PRIMARY: 'fldiT7GQqBoUlnanU',
  FEATURED: 'fldsdW0uRUGtdXZwO',
};
const LIBRARIES = {
  path: '/v0/appS1fzGsI76K6IPO/Internal: QPL Locations',
  view: 'Grid view',
  returnFieldsByFieldId: true,
};
const TOURS = {
  path: '/v0/appS1fzGsI76K6IPO/Tours',
  view: 'Public',
  returnFieldsByFieldId: true,

  NAME: 'fld6TCPloQX95dOVJ',
  IMAGES: 'fldsqdIWbpl4GXLJu',
  DESCRIPTION: 'fldfcR7YEf8T5M0by',
  FEATURED: 'fldmWvev4WRC12YTL',
};
const locationsData = `${AIRTABLE.domain}${LOCATIONS.path}?returnFieldsByFieldId=${LOCATIONS.returnFieldsByFieldId}&view=${LOCATIONS.view}&filterByFormula=${LOCATIONS.filterByFormula}`;
const librariesData = `${AIRTABLE.domain}${LIBRARIES.path}?returnFieldsByFieldId=${LIBRARIES.returnFieldsByFieldId}&view=${LIBRARIES.view}`;
const toursData = `${AIRTABLE.domain}${TOURS.path}?returnFieldsByFieldId=${TOURS.returnFieldsByFieldId}&view=${TOURS.view}`;
const dataFolder = '/public/data';
const pathToData = (name, ext = '.json') => path.join(__dirname, dataFolder, name) + ext;

async function getDataRecursive(endpoint, offsetId) {
  let originalEndpoint = endpoint;
  let offsetableEndpoint = endpoint;

  if (offsetId) {
    offsetableEndpoint = `${originalEndpoint}&offset=${offsetId}`;
  }

  console.log(`Pulling from ${endpoint}`);

  try {
    const { data: { records, offset } } = await axios(offsetableEndpoint, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE.key}`,
      },
    });

    const normalized = records.map(r => {
      return { id: r.id, ...r.fields };
    });

    if (offset) {
      return [...normalized, ...(await getDataRecursive(originalEndpoint, offset))];
    };

    return normalized;
  } catch (e) {
    core.setFailed(e);
  }
}

// execute and persist data
Promise.all([getDataRecursive(locationsData), getDataRecursive(librariesData), getDataRecursive(toursData)]) // no top level await... yet
  .then(([locations, libraries, tours]) => {
    return [
      // merge in tours
      ...tours.filter(t => t[TOURS.IMAGES]).map(t => {
        const firstLocation = locations.find(loc => loc.id === (t[TOURS.IMAGES] || [])[0]) || {};

        return {
          LOCATION_TYPE: 'TOUR',
          ...t,
          [LOCATIONS.TYPE]: 'Tour',
          [LOCATIONS.PLACE_NAME]: t[TOURS.NAME],
          [LOCATIONS.COORDS]: firstLocation[LOCATIONS.COORDS],
          [LOCATIONS.DESCRIPTION]: t[TOURS.DESCRIPTION]
        }
      }),

      ...locations
      .filter(loc => loc[LOCATIONS.COORDS])
      .map(loc => {
        const countUnique = locations.filter(a => a[LOCATIONS.COORDS] === (loc[LOCATIONS.COORDS])).length;

        return {
          ...loc,
          LOCATION_TYPE: 'ASSET',
          IS_UNIQUE: countUnique === 1,
          [LOCATIONS.COORDS]: loc[LOCATIONS.COORDS].trim(),
          [LOCATIONS.IMAGES]: loc[LOCATIONS.IMAGES] ? loc[LOCATIONS.IMAGES].filter(img => img.type.includes('image')) : [],
        }
      }),

      // merge in and normalize qpl location data
      ...libraries.map(l => ({
        id: l.id,
        LOCATION_TYPE: 'MAP_REFERENCE',
        [LOCATIONS.PLACE_NAME]: l['fldeeMEzOJWI4wTCM'],
        [LOCATIONS.COORDS]: `${l['fldeI0ce6r8V7lx9R']}, ${l['fldzDXng4IKA1rBQZ']}`,
        [LOCATIONS.TYPE]: 'Library',
        [LOCATIONS.IMAGES]: [],
        [LOCATIONS.DESCRIPTION]: null,
        [LOCATIONS.SUBMITTED_AT]: null,
        [LOCATIONS.IS_PRIMARY]: true,
        meta: l, // leave the library-specific values
      })),
    ];
  })
  .then(data => {
    return [
      ...data.filter(record => record[LOCATIONS.FEATURED] || record[TOURS.FEATURED]),
      ...shuffleArray(data.filter(record => record[LOCATIONS.IMAGES]?.length)),
      ...data.filter(record => !record[LOCATIONS.IMAGES]?.length),
    ];
  })
  .then((data) => {
    // persist data
    fs.writeFileSync(path.resolve(pathToData('monuments', '.json')), JSON.stringify(data, null, 2));
    fs.writeFileSync(path.resolve(pathToData('monuments', '.geojson')), JSON.stringify(jsonToGeoJson(data)));
  })
  .catch(e => core.setFailed(e));

function jsonToGeoJson(json) {
  const toCoordinates = (row) => row.split(',').reverse().map(c => parseFloat(c.trim()));
  const hasValidCoordinates = (row) => toCoordinates(row).every(parseFloat);

  return  {
    type: 'FeatureCollection',
    features: json
      .filter(row => hasValidCoordinates(row[LOCATIONS.COORDS]))
      .map(row => {
        return {
          type: 'Feature',
          properties: {
            ...row
          },
          geometry: {
            type: 'Point',
            coordinates: toCoordinates(row[LOCATIONS.COORDS]),
          },
        }
      })
  }
}

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}
