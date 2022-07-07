/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useContext } from 'react'
import { useParams } from "react-router-dom";
import MONUMENT from '../models/monument';
import { MapContext } from './App';

function extractMonumentIdentifier(slug) {
  return slug.split('-').reverse()[0];
}

function Detail({ monuments }) {
  const map = useContext(MapContext);
  const [monument, setMonument] = useState({});
  const { slug } = useParams();
  const id = extractMonumentIdentifier(slug);

  useEffect(() => {
    if (monuments.features) {
      const monument = monuments.features.find(m => m.properties.id === id);

      setMonument(monument.properties);

      if (map) {
        map.easeTo({ center: monument.geometry.coordinates });
      }
    }
  }, [id, monuments, map]);

  return <>
    <div className="p-4">
      <h6 className='text-sm'>{monument[MONUMENT.TYPE]}</h6>
      <h1 className='text-3xl'>{monument[MONUMENT.PLACE_NAME]}</h1>
    </div>
    {!!monument[MONUMENT.IMAGES]?.length && <img alt="Location image" className='w-full' src={monument[MONUMENT.IMAGES][0].url}/>}
  </>;
}

export default Detail;
