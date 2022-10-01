import React, { useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select'
import ListResult from '../ui/ListResult';
import { MapContext } from './App';
import LOCATION from '../models/location';
import { LOCATION_TYPES } from '../models/location';
import { makeActiveLocationSelection } from '../features/Location';
import pointsWithinPolygon from '@turf/points-within-polygon';
import circle from '@turf/circle';
import distance from '@turf/distance';

const USE_EXPERIMENTAL_RADIUS_SEARCH = false;

const locationTypes = LOCATION_TYPES
  .filter((_curr, index) => (index % 2) === 0)
  .map(t => ({ label: t, value: t }))
  .slice(0, -1); // removes last color options as it's the default

function Search({ locations }) {
  const map = useContext(MapContext);
  const [params, setSearchParams] = useSearchParams();
  const setFilterParams = (filter) => setSearchParams(filter);
  const filter = {
    key: params.get('key'),
    value: params.get('value'),
  };

  const filteredLocations = useMemo(() => {
    if (USE_EXPERIMENTAL_RADIUS_SEARCH) {
      if (filter.key === LOCATION.COORDS) {
        const center = JSON.parse(`[${filter.value}]`).reverse();
        const radius = circle(center, 0.5, { unit: 'miles' })
  
        return pointsWithinPolygon(locations, radius)?.features.sort((a, b) => {
          return distance(center, a.geometry.coordinates) > distance(center, b.geometry.coordinates) ? 1 : -1;
        });
      }
    }

    return locations?.features.filter(m => {
      if (!filter.key || !filter.value) return true;

      return filter.value.includes(m.properties[filter.key]);
    });
  }, [filter.key, filter.value, locations]);

  useEffect(() => {
    if (map && locations) {
      const primaryLocation = filteredLocations.filter(f => f.properties[LOCATION.IS_PRIMARY] || f.properties.IS_UNIQUE)[0];

      if (primaryLocation && filter.key === LOCATION.COORDS) {
        const makeActiveLocationEffect = makeActiveLocationSelection(map, primaryLocation.geometry.coordinates);

        return () => {
          makeActiveLocationEffect();
        }
      }
    }
  }, [map, locations, filteredLocations, filter.key]);

  const handleFilterChange = (selection, keyName) => {
    selection ? setFilterParams({ key: keyName, value: [selection.value] }) : setFilterParams({});
  }

  return <>
    <h1 className='text-3xl font-feather uppercase pt-4 pl-4'>Queens Name Explorer</h1>
    <div className="flex gap-4 p-4">
      <Select
        className='grow text-gray rounded-md bg-white'
        options={locationTypes}
        isClearable={true}
        onChange={(selection) => { handleFilterChange(selection, LOCATION.TYPE) }}
        placeholder="Filter..."
      />
    </div>
    {filteredLocations?.slice(0,30).map(f=><ListResult key={f.properties.id} result={f} />)}
    {(filteredLocations?.length === 0) && <>
      <div className='p-4'>No matches for "{filter.value}". Showing all:</div>
      {locations?.features?.slice(0,30).map(f=><ListResult key={f.properties.id} result={f} />)}
    </>}
  </>;
}

export default Search;
