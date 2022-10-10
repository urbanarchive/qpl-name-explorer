import React, { useEffect } from 'react';
import { addMapboxMarker } from '../features/MainMap';
import { SelectedIconMarker } from '../features/MainMap';
import LOCATION from '../models/location';
import { DEFAULT_PADDING } from '../ui/Map';
import parse from 'html-react-parser';
import { LazyLoadImage } from 'react-lazy-load-image-component';

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

const AirtableImage = ({ location }) => {
  if (location?.properties[LOCATION.IMAGES]?.length === 0);
  const images = location.properties[LOCATION.IMAGES];

  if (!images) return <></>;

  return images.map(image => <LazyLoadImage
    key={image.filename}
    alt='Location'
    wrapperClassName='w-full'
    className='w-full'
    src={image.url}
    placeholderSrc={image.thumbnails.small.url}
  />);
}

export const LocationHeader = ({ src, alt, type, name, children }) => <div className='p-4'>
  <h6 className='text-sm'>
    <img src={src} alt={alt} className="w-8 h-8 inline mr-1" />
    {type}
  </h6>
  <h1 className='text-3xl font-feather leading-[2.215rem] uppercase'>
    {name}
    {children}
  </h1>
</div>

export const LocationBody = ({ location }) => <>
  <AirtableImage location={location}/>
  <div className='p-4 whitespace-pre-line wrap'>
    {location?.properties[LOCATION.CITATION] &&
      <p className='text-sm text-left mb-1'>{location?.properties[LOCATION.CITATION]}</p>
    }
    <p className='mb-2'>
      {location?.properties[LOCATION.DESCRIPTION]}
    </p>
    {location?.formattedSourceDescription &&
      <p className='text-sm whitespace-pre-line break-words'>
        <b className='font-bold'>Source:</b> {parse(location?.formattedSourceDescription)}
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
