import React from 'react';
import { Link } from 'react-router-dom';
import MONUMENT from '../models/monument';
import sluggify from '../utils/sluggify';

function List({ monuments }) {
  return <>
    {monuments?.features.map(f=>
      <div key={f.properties.id} className="flex gap-4 p-4">
        <div className="flex w-14">
          {f.properties[MONUMENT.IMAGES] && <div
            style={{ backgroundImage: `url(${f.properties[MONUMENT.IMAGES][0]?.thumbnails.large.url})` }}
            className="bg-cover bg-center w-full h-full"
            alt="desflaksjdfkl"
          />}
        </div>
        <div className="flex flex-col grow truncate">
          <Link
            to={`monuments/${sluggify(f.properties)}`}
            className='font-bold'
          >{f.properties[MONUMENT.PLACE_NAME]}</Link>
          <h4 className='font-thin text-sm'>{f.properties[MONUMENT.TYPE]}</h4>
          <span className='text-sm truncate'>{f.properties[MONUMENT.DESCRIPTION].substring(0, 50)}</span>
        </div>
        <div className="flex items-center">
          {f.properties[MONUMENT.SUBMITTED_AT] && (new Date(f.properties[MONUMENT.SUBMITTED_AT])).toLocaleDateString()}
        </div>
      </div>
    )}
  </>;
}

export default List;
