#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const core = require('@actions/core');

// SEE src/models/monument.js
const COORDS_FIELD = 'fld03C27tmVnEg1rP';

const AIRTABLE = {
  domain: 'https://api.airtable.com',
  path: '/v0/appS1fzGsI76K6IPO/Collections Metadata',
  view: 'U/A view',
  filterByFormula: '{Ready for U/A}=1',
  returnFieldsByFieldId: true,
  key: process.env.AIRTABLE_API_KEY,
}
const librariesEndpoint = `${AIRTABLE.domain}${AIRTABLE.path}?returnFieldsByFieldId=${AIRTABLE.returnFieldsByFieldId}&view=${AIRTABLE.view}&filterByFormula=${AIRTABLE.filterByFormula}`;
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
getDataRecursive(librariesEndpoint) // no top level await... yet
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
      .filter(row => !!row[COORDS_FIELD])
      .map(row => {
        return {
          type: 'Feature',
          properties: {
            ...row
          },
          geometry: {
            type: 'Point',
            coordinates: row[COORDS_FIELD].split(',').reverse().map(c => parseFloat(c.trim())),
          },
        }
      })
  }
}
