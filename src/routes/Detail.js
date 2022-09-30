/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useContext } from 'react'
import { useParams } from "react-router-dom";
import MONUMENT from '../models/monument';
import { MapContext } from './App';
import { resultFactory } from '../models/monument';
import { DEFAULT_PADDING } from '../ui/Map';
import { addMapboxMarker } from '../features/MainMap';
import { SimpleMarker } from '../features/MainMap';
import parse from 'html-react-parser';
import ICONS from '../features/images/icons';
import { TOUR } from '../models/monument';

const LocationImage = ({ src }) => 
  <img alt="Location image" className='w-full' src={src}/>

const LocationHeader = ({ src, alt, type, name }) => <div className='p-4'>
  <h6 className='text-sm'>
    <img src={src} alt={alt} className="w-8 h-8 inline mr-1" />
    {type}
  </h6>
  <h1 className='text-3xl font-feather'>{name}</h1>
</div>

const AssetView = ({ location }) => <>
  <LocationHeader
    src={location?.iconData}
    alt={location?.properties[MONUMENT.TYPE]}
    type={location?.properties[MONUMENT.TYPE]}
    name={location?.properties[MONUMENT.PLACE_NAME]}
  />
  {!!location?.properties[MONUMENT.IMAGES]?.length && <LocationImage src={location?.properties[MONUMENT.IMAGES][0].url}/>}
  {location?.properties[MONUMENT.CITATION] &&
    <p className='text-sm p-1 text-right'>{location?.properties[MONUMENT.CITATION]}</p>
  }
  <div className='p-4 whitespace-pre-line wrap'>
    <p>
      {location?.properties[MONUMENT.DESCRIPTION]}
    </p>
    {location?.formattedSourceDescription &&
      <p className='text-sm p-1 whitespace-pre-line break-words'>
        Source: {parse(location?.formattedSourceDescription)}
      </p>
    }
  </div>
</>;

const TourView = ({ location, locations }) => {
  if (!location || !locations) return;

  const stops = locations.features.filter(loc => location.properties[TOUR.IMAGES].includes(loc.properties.id));

  return <>
    <LocationHeader
      src={ICONS.library}
      alt={'tour'}
      type={'Tour'}
      name={location?.properties[MONUMENT.PLACE_NAME]}
    />
    {stops.map((stop, id) => <div key={id}>
      <h2 className='text-lg'>{stop.properties[MONUMENT.PLACE_NAME]}</h2>
      {stop.properties[MONUMENT.IMAGES]?.map(image => <LocationImage src={image.url} />)}
    </div>)}
  </>
};

export const DEFAULT_DETAIL_ZOOM = {
  ...DEFAULT_PADDING,
  zoom: 14,
}

export const makeActiveLocationSelection = (map, coords) => {
  const { zoom, ...otherDefaults } = DEFAULT_DETAIL_ZOOM;
  const currentZoom = map.getZoom();

  map.easeTo({ center: coords, ...otherDefaults, zoom: (currentZoom < zoom) ? zoom : currentZoom });

  if (coords) {
    const marker = addMapboxMarker(<SimpleMarker
        className={'w-auto h-auto'}
        src={ICONS['selected']}
      />, coords, map, { anchor: 'bottom', offset: [0, 20] });

    return () => {
      marker.remove();
    };
  }
}

function extractlocationIdentifier(slug) {
  return slug.split('-').reverse()[0];
}

function Detail({ monuments: locations }) {
  const map = useContext(MapContext);
  const [location, setlocation] = useState({});
  const { slug } = useParams();
  const id = extractlocationIdentifier(slug);

  useEffect(() => {
    if (locations.features) {
      const location = locations.features.find(m => m.properties.id === id);

      setlocation(resultFactory(location));

      if (map) {
        const makeActiveLocationEffect = makeActiveLocationSelection(map, location.geometry.coordinates);

        return () => {
          makeActiveLocationEffect();
        }
      }
    }
  }, [id, locations, map]);

  return <main>
    {location?.properties?.LOCATION_TYPE === 'ASSET' && <AssetView location={location}/>}
    {location?.properties?.LOCATION_TYPE === 'TOUR' && <TourView location={location} locations={locations} />}
  </main>;
}

export default Detail;
