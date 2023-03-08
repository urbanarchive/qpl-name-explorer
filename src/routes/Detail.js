import React, { useEffect, useState, useContext } from 'react';
import { useParams } from "react-router-dom";
import { MapContext } from './App';
import LOCATION, { resultFactory } from '../models/location';
import { DEFAULT_PADDING } from '../ui/Map';
import { extractlocationIdentifier } from '../models/location';
import TourView from '../features/Tour';
import LocationView from '../features/Location';
import CloseButton from '../ui/CloseButton';

export const DEFAULT_DETAIL_ZOOM = {
  ...DEFAULT_PADDING,
  zoom: 14,
}

function Detail({ locations }) {
  const map = useContext(MapContext);
  const [location, setlocation] = useState({});
  const { slug } = useParams();
  const id = extractlocationIdentifier(slug);

  function titleForLocation(location) {
    let title = "Queens Name Explorer";
/* Analytics will reflect aggregate data for all records with the same location.
  To change this, uncomment below to add unique RecordID to the end of titles. */
//    const recordId = slug?.match(/rec[a-zA-Z0-9]{14}/)?.[0];
//    if (recordId) title = `${title} (${recordId})`;
    const locationName = location?.properties?.[LOCATION.PLACE_NAME];
    if (locationName) title = `${locationName} | ${title}`;

    return title;
  }

  useEffect(() => {
    document.title = titleForLocation(location);

    return () => { document.title = "Queens Name Explorer"; };
  }, [location, slug]);

  useEffect(() => {    
    const gtag = window.gtag;
    
    if (gtag) {
      gtag('event', 'page_view', {
        'page_location': window.location.href,
        'page_title': titleForLocation(location),
        'org_slug': 'qplnyc' // Org slug as defined in the UA backend
      });
    }
  }, [location])

  useEffect(() => {
    if (locations.features) {
      const location = locations.features.find(m => m.properties.id === id);

      setlocation(resultFactory(location));
    }
  }, [id, locations]);

  if (!location) return;

  return <main>
    <CloseButton />
    {location?.properties?.LOCATION_TYPE === 'ASSET' && <LocationView location={location} map={map}/>}
    {location?.properties?.LOCATION_TYPE === 'TOUR' && <TourView location={location} locations={locations} map={map} />}
  </main>;
}

export default Detail;
