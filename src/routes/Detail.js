import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";

function extractMonumentIdentifier(slug) {
  return slug.split('-').reverse()[0];
}

function Detail() {
  const [monuments, setData] = useState({});
  const [monument = {}, setMonument] = useState({});
  const { slug } = useParams();
  const id = extractMonumentIdentifier(slug);

  // get all monuments
  useEffect(() => {
    async function fetchData() {
      const data = await (await fetch('/data/monuments.geojson')).json();

      setData(data);
    }

    fetchData();
  }, []);

  useEffect(() => {
    if (monuments.features) {
      setMonument(monuments.features.find(m => m.properties.id === id).properties);
    }
  }, [id, monuments]);

  console.log(monument);
  
  return <>
    <div>Search stories</div>
    <div>Search this area</div>
    <div>All content dropdown</div>
    <h1>{monument['Place name']}</h1>
  </>;
}

export default Detail;
