#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const core = require('@actions/core');

const AIRTABLE = {
  domain: 'https://api.airtable.com',
  path: '/v0/appS1fzGsI76K6IPO/Collections Metadata',
  maxRecords: -1,
  view: 'U/A view',
  key: process.env.AIRTABLE_API_KEY,
}
const endpoint = `${AIRTABLE.domain}${AIRTABLE.path}?maxRecords=${AIRTABLE.maxRecords}&view=${AIRTABLE.view}`;
const dataFolder = '/public/data';
const pathToData = (ext = '.json') => path.join(__dirname, dataFolder, 'monuments') + ext;

async function getData() {
  try {
    const { data: { records } } = await axios(endpoint, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE.key}`,
      },
    });

    return records.map(r => {
      return { id: r.id, ...r.fields };
    });
  } catch (e) {
    core.setFailed(e);
  }
}

// execute and persist data
getData() // no top level await... yet
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
      .filter(row => !!row['Georef (U/A)'])
      .map(row => {
        return {
          type: 'Feature',
          properties: {
            ...row
          },
          geometry: {
            type: 'Point',
            coordinates: row['Georef (U/A)'].split(',').reverse().map(c => parseFloat(c.trim())),
          },
        }
      })
  }
}
