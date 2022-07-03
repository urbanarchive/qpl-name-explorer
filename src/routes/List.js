import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import bbox from '@turf/bbox';
import { MapContext } from './App';
import MONUMENT from '../models/monument';
import sluggify from '../utils/sluggify';
import { MONUMENT_TYPES } from '../features/MainMap';

function getMonumentTypeColor(type) {
  return MONUMENT_TYPES[MONUMENT_TYPES.findIndex(t => t === type) + 1];
}

function List({ monuments }) {
  const map = useContext(MapContext);

  useEffect(() => {
    if (map && monuments) {
      map.fitBounds(bbox(monuments), { padding: 100 });
    }
  }, [map, monuments]);

  return <>
    {monuments?.features.map(f=>
      <div key={f.properties.id} className="flex gap-4 p-4">
        <Link to={`monuments/${sluggify(f.properties)}`} className="flex w-14">
          {f.properties[MONUMENT.IMAGES] && <div
            style={{ backgroundImage: `url(${f.properties[MONUMENT.IMAGES][0]?.thumbnails.large.url})` }}
            className="bg-cover bg-center w-full h-full hover:border-purple-600 border-2 rounded-md"
            alt="desflaksjdfkl"
          />}
        </Link>
        <Link to={`monuments/${sluggify(f.properties)}`} className="flex flex-col grow truncate hover:text-purple-600">
          <h2 className='font-bold'>{f.properties[MONUMENT.PLACE_NAME]}</h2>
          <h4
            className={`font-thin text-sm text-[${getMonumentTypeColor(f.properties[MONUMENT.TYPE])}]`}
          >
            {f.properties[MONUMENT.TYPE]}
          </h4>
          <span className='text-sm truncate'>{f.properties[MONUMENT.DESCRIPTION].substring(0, 50)}</span>
        </Link>
        <div className="flex items-center">
          {f.properties[MONUMENT.SUBMITTED_AT] && (new Date(f.properties[MONUMENT.SUBMITTED_AT])).toLocaleDateString()}
        </div>
      </div>
    )}
  </>;
}

export default List;
