const fs = require("fs");
const path = require("path");
const axios = require("axios");

const OVERPASS_ENDPOINT = "https://overpass-api.de/api/interpreter";
const OSM_URL_COLUMN = "fldRVYhlmgXfsXhzN";
const monuments_file = "./public/data/monuments.json";
const lines_polygons_file = "./public/data/lines_polygons.geojson";

function checkIfArea(tags) {
  if (tags.leisure) return true;

  return false;
}

async function getGeoJSONfromOSM(id, url) {
  const [section, type, osmid] = /org\/(.+)\/([0-9]+)/g.exec(url);

  const query = `
    [out:json];
    ${type}(${osmid});
    out geom;
    `;

  return axios
    .post(OVERPASS_ENDPOINT, query)
    .then((response) => {
      const obj = response.data.elements[0];
      //todo: add cond for if no elements return / invalid query
      //todo deal with outer and inners
      let coordinates = [];

      switch (obj.type) {
        case "relation":
          coordinates = obj.members.reduce((coords, member) => {
            if (member.type === "way") {
              coords.push(
                member.geometry.map((point) => [point.lon, point.lat])
              );
            }
            return coords;
          }, []);
          return {
            type: "Feature",
            properties: { id },
            geometry: {
              coordinates,
              type: checkIfArea(obj.tags) ? "Polygon" : "MultiLineString",
            },
          };

        case "way":
          coordinates = obj.geometry.map((point) => [point.lon, point.lat]);
          return {
            type: "Feature",
            properties: { id },
            geometry: {
              coordinates: checkIfArea(obj.tags) ? [coordinates] : coordinates,
              type: checkIfArea(obj.tags) ? "Polygon" : "LineString",
            },
          };
      }
    })
    .catch((error) => console.error(error));
}

async function main() {
  const data = await fs.readFileSync(monuments_file, "utf-8");
  const monuments = JSON.parse(data);

  const monuments_with_osm = monuments.filter(
    (d) =>
      OSM_URL_COLUMN in d && d[OSM_URL_COLUMN].includes("www.openstreetmap.org")
  );

  const features = [];
  //promise all doesnt work since overpass rate limits
  for (let d of monuments_with_osm) {
    const feature = await getGeoJSONfromOSM(d.id, d[OSM_URL_COLUMN]);
    features.push(feature);
  }

  const fc = {
    type: "FeatureCollection",
    features,
  };

  fs.writeFileSync(lines_polygons_file, JSON.stringify(fc), "utf-8");
}

main();
