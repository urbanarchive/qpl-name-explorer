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
  ATTACHMENTS: 'fldchc6j0XRMy0vb9',
  TYPE: 'fldb2kOoaaol8IIiQ',
  IMAGES: 'fldchc6j0XRMy0vb9',
  DESCRIPTION: 'fld18VKjlf9BGaE9N',
  SUBMITTED_AT: 'fld63z0I0JEzkE26Z',
  IS_PRIMARY: 'fldiT7GQqBoUlnanU',
};
const LIBRARIES = {
  path: '/v0/appS1fzGsI76K6IPO/Internal: QPL Locations',
  view: 'Grid view',
  returnFieldsByFieldId: true,
};
const locationsData = `${AIRTABLE.domain}${LOCATIONS.path}?returnFieldsByFieldId=${LOCATIONS.returnFieldsByFieldId}&view=${LOCATIONS.view}&filterByFormula=${LOCATIONS.filterByFormula}`;
const librariesData = `${AIRTABLE.domain}${LIBRARIES.path}?returnFieldsByFieldId=${LIBRARIES.returnFieldsByFieldId}&view=${LIBRARIES.view}`;
const dataFolder = '/public/data';
const pathToData = (ext = '.json') => path.join(__dirname, dataFolder, 'monuments') + ext;

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
Promise.all([getDataRecursive(locationsData), getDataRecursive(librariesData)]) // no top level await... yet
  .then(([locations, libraries]) => {
    // merge in and normalize qpl location data
    return [
      ...locations,
      ...libraries.map(l => ({
        id: l.id,
        [LOCATIONS.PLACE_NAME]: l['fldeeMEzOJWI4wTCM'],
        [LOCATIONS.COORDS]: `${l['fldeI0ce6r8V7lx9R']}, ${l['fldzDXng4IKA1rBQZ']}`,
        [LOCATIONS.TYPE]: 'Library',
        [LOCATIONS.IMAGES]: [],
        [LOCATIONS.DESCRIPTION]: null,
        [LOCATIONS.SUBMITTED_AT]: null,
        [LOCATIONS.IS_PRIMARY]: true,
        meta: l, // leave the library-specific values
      }))
    ];
  })
  .then((data) => {
    // persist data
    fs.writeFileSync(path.resolve(pathToData('.json')), JSON.stringify(data, null, 2));
    fs.writeFileSync(path.resolve(pathToData('.geojson')), JSON.stringify(jsonToGeoJson(data)));
  })
  .catch(e => core.setFailed(e));

function jsonToGeoJson(json) {
  return  {
    type: 'FeatureCollection',
    features: json
      .filter(row => !!row[LOCATIONS.COORDS])
      .map(row => {
        return {
          type: 'Feature',
          properties: {
            ...row
          },
          geometry: {
            type: 'Point',
            coordinates: row[LOCATIONS.COORDS].split(',').reverse().map(c => parseFloat(c.trim())),
          },
        }
      })
  }
}
