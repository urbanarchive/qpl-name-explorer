import React, { useContext, useEffect, useState } from 'react';
import bbox from '@turf/bbox';
import Select from 'react-select'
import ListResult from '../ui/ListResult';
import { MapContext } from './App';
import MONUMENT from '../models/monument';
import { MONUMENT_TYPES } from '../features/MainMap';

const LOCATION_TYPES = MONUMENT_TYPES
  .filter((_curr, index) => (index % 2) === 0)
  .map(t => ({ label: t, value: t }))
  .slice(0, -1); // removes last color options as it's the default

function List({ monuments }) {
  const map = useContext(MapContext);
  const [selectedFilter, setFilter] = useState();

  useEffect(() => {
    if (map && monuments) {
      map.fitBounds(bbox(monuments), { padding: 100 });
    }
  }, [map, monuments]);

  const handleFilterChange = (selection, keyName) => {
    selection ? setFilter({ key: keyName, value: [selection.value] }) : setFilter(null);
  }

  const handleAreaFilter = () => {
    if (map) {
      if (selectedFilter?.key === 'id') {
        setFilter(null);

        return;
      }

      const ids = map.queryRenderedFeatures({ layers: ['monuments-circle'] }).map(f => f.id);

      setFilter({ key: 'id', value: ids });
    }
  };

  const filteredLocations = {
    ...monuments,
    features: monuments?.features.filter(m => {
      return selectedFilter?.value ? (selectedFilter.value.includes(m.properties[selectedFilter.key])) : true;
    }),
  };

  return <>
    <div className="flex gap-4 p-4 pt-0">
      <button
        className={`flex text-white rounded-md p-2 bg-purple-600 ${selectedFilter?.key === 'id' ? 'bg-gray-400' : ''}`}
        onClick={handleAreaFilter}
      >
        {selectedFilter?.key === 'id' ? 'X ' : ''}
        Search this area
      </button>
      <Select
        className='grow text-gray rounded-md bg-white'
        options={LOCATION_TYPES}
        isClearable={true}
        onChange={(selection) => { handleFilterChange(selection, MONUMENT.TYPE) }}
      />
    </div>
    {filteredLocations?.features?.map(f=><ListResult key={f.properties.id} result={f} />)}
    {(filteredLocations?.features?.length === 0) && <>
      <div className='p-4'>No matches for "{selectedFilter.value}". Showing all:</div>
      {monuments?.features?.map(f=><ListResult key={f.properties.id} result={f} />)}
    </>}
  </>;
}

export default List;
