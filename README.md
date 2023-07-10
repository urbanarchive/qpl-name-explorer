# Getting Started with Create React App

Tailwind, Mapbox, Airtable, React

### `yarn run start`
### `yarn run build`

# Data

## Community Districts

```bash
ogr2ogr tmp/cds.geojson \
  -f GeoJSON "https://services3.arcgis.com/hTqPmMLSgYuv8Z0u/arcgis/rest/services/Community_District/FeatureServer/0/query?where=1=1&outfields=*&f=json" ESRIJSON -t_srs EPSG:4326
```

## NTAs

```bash
ogr2ogr tmp/ntas.geojson \
  -f GeoJSON "https://services3.arcgis.com/hTqPmMLSgYuv8Z0u/arcgis/rest/services/nynta2020_22a/FeatureServer/0/query?where=1=1&outfields=*&f=json" ESRIJSON -t_srs EPSG:4326
```

## City Councils

```bash
ogr2ogr tmp/city_councils.geojson \
  -f GeoJSON "https://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/NYC_City_Council_Districts/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson" -t_srs EPSG:4326
```
