import React, { useEffect } from 'react';
import { addMapboxMarker } from '../features/MainMap';
import { SelectedIconMarker } from '../features/MainMap';
import LOCATION from '../models/location';
import { DEFAULT_PADDING } from '../ui/Map';
import parse from 'html-react-parser';

const DEFAULT_DETAIL_ZOOM = {
  ...DEFAULT_PADDING,
  zoom: 14,
}

export const zoomToLocation = (map, coords) => {
  const { zoom, ...otherDefaults } = DEFAULT_DETAIL_ZOOM;
  const currentZoom = map.getZoom();

  map.easeTo({ center: coords, ...otherDefaults, zoom: (currentZoom < zoom) ? zoom : currentZoom });
}

export const makeActiveLocationSelection = (map, coords) => {
  zoomToLocation(map, coords);

  if (coords) {
    const marker = addMapboxMarker(
      <SelectedIconMarker />,
      coords,
      map,
      { anchor: 'bottom', offset: [0, 20] }
    );

    return () => {
      marker.remove();
    };
  }
}

const LocationImage = ({ src }) => 
  <img alt="Location" className='w-full' src={src}/>

export const LocationHeader = ({ src, alt, type, name, children }) => <div className='p-4'>
  <h6 className='text-sm'>
    <img src={src} alt={alt} className="w-8 h-8 inline mr-1" />
    {type}
  </h6>
  <h1 className='text-3xl font-feather'>
    {name}
    {children}
  </h1>
</div>

export const LocationBody = ({ location }) => <>
  {!!location?.properties[LOCATION.IMAGES]?.length && <LocationImage src={location?.properties[LOCATION.IMAGES][0].url}/>}
  {location?.properties[LOCATION.CITATION] &&
    <p className='text-sm p-1 text-right'>{location?.properties[LOCATION.CITATION]}</p>
  }
  <div className='p-4 whitespace-pre-line wrap'>
    <p>
      {location?.properties[LOCATION.DESCRIPTION]}
    </p>
    {location?.formattedSourceDescription &&
      <p className='text-sm p-1 whitespace-pre-line break-words'>
        Source: {parse(location?.formattedSourceDescription)}
      </p>
    }
  </div>
</>;

const LocationView = ({ location, map }) => {
  useEffect(() => {
    if (map) {
      const makeActiveLocationEffect = makeActiveLocationSelection(map, location.geometry.coordinates);

      return () => {
        makeActiveLocationEffect();
      }
    }
  });

  return <>
    <LocationHeader
      src={location?.iconData}
      alt={location?.properties[LOCATION.TYPE]}
      type={location?.properties[LOCATION.TYPE]}
    >
      {location?.properties[LOCATION.PLACE_NAME]}
    </LocationHeader>
    <LocationBody location={location}/>
  </>;
};

export default LocationView;
