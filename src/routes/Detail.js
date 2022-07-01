/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState } from 'react'
import Header from '../ui/Header';
import { useParams } from "react-router-dom";
import MONUMENT from '../models/monument';

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
    <Header />
    <div className="p-4">
      <h6 className='text-sm'>{monument[MONUMENT.TYPE]}</h6>
      <h1 className='text-3xl'>{monument[MONUMENT.PLACE_NAME]}</h1>
    </div>
    {monument[MONUMENT.IMAGES] && <img alt="Location image" className='w-full' src={monument[MONUMENT.IMAGES][0].url}/>}
  </>;
}

export default Detail;
