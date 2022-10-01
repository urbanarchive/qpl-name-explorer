/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useEffect, useState, useContext, useRef } from 'react'
import { useParams } from "react-router-dom";
import MONUMENT from '../models/monument';
import { MapContext } from './App';
import { resultFactory } from '../models/monument';
import { DEFAULT_PADDING } from '../ui/Map';
import { addMapboxMarker } from '../features/MainMap';
import { extractlocationIdentifier } from '../models/monument';
import parse from 'html-react-parser';
import ICONS from '../features/images/icons';
import { TOUR } from '../models/monument';
import bbox from '@turf/bbox';
import { SelectedIconMarker } from '../features/MainMap';

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

const LocationImage = ({ src }) => 
  <img alt="Location image" className='w-full' src={src}/>

const LocationHeader = ({ src, alt, type, name }) => <div className='p-4'>
  <h6 className='text-sm'>
    <img src={src} alt={alt} className="w-8 h-8 inline mr-1" />
    {type}
  </h6>
  <h1 className='text-3xl font-feather'>{name}</h1>
</div>

const LocationBody = ({ location }) => <>
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

const AssetView = ({ location, map }) => {
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
      alt={location?.properties[MONUMENT.TYPE]}
      type={location?.properties[MONUMENT.TYPE]}
      name={location?.properties[MONUMENT.PLACE_NAME]}
    />
    <LocationBody location={location}/>
  </>;
};

const TourStop = ({ stopNumber, stop, map }) => {
  const elementRef = useRef(null);
  const executeScroll = () => elementRef.current.scrollIntoView({ behavior: 'smooth' });
  const isVisible = useOnScreen(elementRef);

  useEffect(() => {
    if (map) {
      const marker = addMapboxMarker(
        <SelectedIconMarker
          onClick={() => executeScroll()}
          className={`${isVisible && 'animate-bounce'}`}
        >
          <div className={`${isVisible && 'animate-bounce'} absolute w-full h-full top-0 text-center pt-1 pointer-events-none`}>
            <span className='p-1 text-2xl'>{stopNumber + 1}</span>
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
      alt={stop?.properties[MONUMENT.TYPE]}
      type={stop?.properties[MONUMENT.TYPE]}
      name={`${stopNumber + 1}. ${stop?.properties[MONUMENT.PLACE_NAME]}`}
    />
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
      src={ICONS.library}
      alt={'tour'}
      type={'Tour'}
      name={location?.properties[MONUMENT.PLACE_NAME]}
    />
    {stops.map((stop, index) => <TourStop key={index} stopNumber={index} stop={stop} map={map} />)}
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

export const makeActiveTourEffect = (map, stops) => {
  const bounds = bbox({ type: 'FeatureCollection', features: stops });
  const isNotPadded = Object.values(map.getPadding()).every(num => num === 0)

  map.fitBounds(bounds, { ...(isNotPadded ? DEFAULT_PADDING : {}) });
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
    }
  }, [id, locations]);

  if (!location) return;

  return <main>
    {location?.properties?.LOCATION_TYPE === 'ASSET' && <AssetView location={location} map={map}/>}
    {location?.properties?.LOCATION_TYPE === 'TOUR' && <TourView location={location} locations={locations} map={map} />}
  </main>;
}

export default Detail;
