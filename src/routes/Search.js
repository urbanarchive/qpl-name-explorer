import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Select from 'react-select'
import ListResult from '../ui/ListResult';
import { MapContext } from './App';
import MONUMENT from '../models/monument';
import { MONUMENT_TYPES } from '../models/monument';

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

  useEffect(() => {
    if (map && monuments) {
      // TODO: Unsure about when to fit bounds or not...
      // map.fitBounds(bbox(monuments), {
      //   // TODO: reference the content pane for this information
      //   ...DEFAULT_PADDING,
      // });
    }
  }, [map, monuments]);

  const filteredLocations = {
    ...monuments,
    features: monuments?.features.filter(m => {
      if (!filter.key || !filter.value) return true;

      return filter.value.includes(m.properties[filter.key]);
    })
  };

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
    {filteredLocations?.features?.map(f=><ListResult key={f.properties.id} result={f} />)}
    {(filteredLocations?.features?.length === 0) && <>
      <div className='p-4'>No matches for "{filter.value}". Showing all:</div>
      {monuments?.features?.map(f=><ListResult key={f.properties.id} result={f} />)}
    </>}
  </>;
}

export default Search;
