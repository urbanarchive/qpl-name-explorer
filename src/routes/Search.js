import React, { useContext, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select'
import ListResult from '../ui/ListResult';
import { MapContext } from './App';
import MONUMENT from '../models/monument';
import { MONUMENT_TYPES } from '../models/monument';
import { makeActiveLocationSelection } from './Detail';

const LOCATION_TYPES = MONUMENT_TYPES
  .filter((_curr, index) => (index % 2) === 0)
  .map(t => ({ label: t, value: t }))
  .slice(0, -1); // removes last color options as it's the default

function Search({ monuments }) {
  const map = useContext(MapContext);
  const [params, setSearchParams] = useSearchParams();
  const setFilterParams = (filter) => setSearchParams(filter);
  const filter = {
    key: params.get('key'),
    value: params.get('value'),
  };

  const filteredLocations = useMemo(() => monuments?.features.filter(m => {
    if (!filter.key || !filter.value) return true;
    console.log(m.properties[filter.key], filter.value);
    return filter.value.includes(m.properties[filter.key]);
  }), [filter.key, filter.value, monuments?.features]);

  useEffect(() => {
    if (map && monuments) {
      const primaryLocation = filteredLocations.filter(f => f.properties[MONUMENT.IS_PRIMARY] || f.properties.IS_UNIQUE)[0];

      if (primaryLocation && filter.key === MONUMENT.COORDS) {
        const makeActiveLocationEffect = makeActiveLocationSelection(map, primaryLocation.geometry.coordinates);

        return () => {
          makeActiveLocationEffect();
        }
      }
    }
  }, [map, monuments, filteredLocations, filter.key]);


  const handleFilterChange = (selection, keyName) => {
    selection ? setFilterParams({ key: keyName, value: [selection.value] }) : setFilterParams({});
  }

  return <>
    <h1 className='text-3xl font-feather uppercase pt-4 pl-4'>Queens Name Explorer</h1>
    <div className="flex gap-4 p-4">
      <Select
        className='grow text-gray rounded-md bg-white'
        options={LOCATION_TYPES}
        isClearable={true}
        onChange={(selection) => { handleFilterChange(selection, MONUMENT.TYPE) }}
        placeholder="Filter..."
      />
    </div>
    {filteredLocations?.map(f=><ListResult key={f.properties.id} result={f} />)}
    {(filteredLocations?.length === 0) && <>
      <div className='p-4'>No matches for "{filter.value}". Showing all:</div>
      {monuments?.features?.map(f=><ListResult key={f.properties.id} result={f} />)}
    </>}
  </>;
}

export default Search;
