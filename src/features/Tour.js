import React, { useEffect, useState, useRef } from 'react'
import bbox from '@turf/bbox';
import LOCATION from '../models/location';
import { DEFAULT_PADDING } from '../ui/Map';
import { addMapboxMarker } from '../features/MainMap';
import { SelectedIconMarker } from '../features/MainMap';
import { LocationHeader, LocationBody } from './Location';
import { TOUR } from '../models/location';
import { resultFactory } from '../models/location';
import ICONS from '../features/images/icons';
import { zoomToLocation } from './Location';

export const makeActiveTourEffect = (map, stops) => {
  const bounds = bbox({ type: 'FeatureCollection', features: stops });
  const isNotPadded = Object.values(map.getPadding()).every(num => num === 0)

  map.fitBounds(bounds, { ...(isNotPadded ? DEFAULT_PADDING : {}) });
}

export function useOnScreen(ref) {

  const [isIntersecting, setIntersecting] = useState(false)

  const observer = new IntersectionObserver(
    ([entry]) => setIntersecting(entry.isIntersecting)
  )

  useEffect(() => {
    observer.observe(ref.current)
    // Remove the observer as soon as the component is unmounted
    return () => { observer.disconnect() }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return isIntersecting
}

const TourStop = ({ stopNumber, stop, map }) => {
  const elementRef = useRef(null);
  const executeScroll = () => elementRef.current.scrollIntoView({ behavior: 'smooth' });
  const isVisible = useOnScreen(elementRef);

  useEffect(() => {
    if (map) {
      const marker = addMapboxMarker(
        <SelectedIconMarker
          onClick={() => executeScroll()}
          className={`${isVisible ? 'animate-bounce' : 'w-6 h-7'}`}
        >
          <div className={`${isVisible && 'animate-bounce'} absolute w-full h-full top-0 text-center pt-1 pointer-events-none`}>
            <span className={`p-1 ${isVisible ? 'text-2xl' : 'text-sm'}`}>{stopNumber + 1}</span>
          </div>
        </SelectedIconMarker>,
        stop.geometry.coordinates,
        map,
        { anchor: 'bottom', offset: [0, 20] }
      );
  
      return () => {
        marker.remove();
      };
    }
  }, [map, stop.geometry.coordinates, stopNumber, isVisible]);

  return <><div ref={elementRef} key={stopNumber}>
    <LocationHeader
      src={stop?.iconData}
      alt={stop?.properties[LOCATION.TYPE]}
      type={stop?.properties[LOCATION.TYPE]}
    >
      <div className='flex items-center gap-2'>
        <div
          onClick={() => zoomToLocation(map, stop?.geometry.coordinates)}
          className='w-5 h-5 rounded-full flex justify-center items-center bg-black text-white text-xs border-solid border-white border-2 drop-shadow-md hover:scale-125 duration-100 hover:cursor-pointer'
        >
          {stopNumber + 1}
        </div>
        <span className='inline'>{stop?.properties[LOCATION.PLACE_NAME]}</span>
      </div>
    </LocationHeader>
    <LocationBody location={stop}/>
  </div><br/></>
};

const TourView = ({ location, locations, map }) => {
  const stops = locations.features
    .filter(loc => location.properties[TOUR.IMAGES].includes(loc.properties.id))
    .map(resultFactory);

  useEffect(() => {
    if (map) {
      makeActiveTourEffect(map, stops);
    }
  });

  return <>
    <LocationHeader
      src={ICONS.tour}
      alt={'tour'}
      type={'Tour'}
      name={location?.properties[LOCATION.PLACE_NAME]}
    />
    {stops.map((stop, index) => <TourStop key={index} stopNumber={index} stop={stop} map={map} />)}
  </>
};

export default TourView;
