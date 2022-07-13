import React, { useContext, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
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

function Search({ monuments }) {
  const map = useContext(MapContext);
  const [params, setSearchParams] = useSearchParams();
  const setFilterParams = (filter) => setSearchParams(filter);
  const filter = {
    key: params.get('key'),
    value: params.get('value'),
  }

  useEffect(() => {
    if (map && monuments) {
      map.fitBounds(bbox(monuments), {
        // TODO: reference the content pane for this information
        padding: { left: 500, top: 30, bottom: 30 },
      });
    }
  }, [map, monuments]);

  const handleFilterChange = (selection, keyName) => {
    selection ? setFilterParams({ key: keyName, value: [selection.value] }) : setFilterParams({});
  }

  const handleAreaFilter = () => {
    if (map) {
      if (filter?.key === 'id') {
        setFilterParams({});

        return;
      }

      const ids = map.queryRenderedFeatures({ layers: ['monuments-circle'] });
      const bounds = bbox({ type: 'FeatureCollection', features: ids });
      map.fitBounds(bounds);

      setFilterParams({ key: 'id', value: ids.map(f => f.id).join(',') });
    }
  };

  const filteredLocations = {
    ...monuments,
    features: monuments?.features.filter(m => {
      if (!filter.key || !filter.value) return true;

      return filter.value.includes(m.properties[filter.key]);
    })
  };

  return <>
    <div className="flex gap-4 p-4">
      <button
        className={`flex text-white rounded-md p-2 bg-qpl-purple ${filter?.key === 'id' ? 'bg-gray-400' : ''}`}
        onClick={handleAreaFilter}
      >
        {filter?.key === 'id' ? 'X ' : ''}
        Search this area
      </button>
      <Select
        className='grow text-gray rounded-md bg-white'
        options={LOCATION_TYPES}
        isClearable={true}
        onChange={(selection) => { handleFilterChange(selection, MONUMENT.TYPE) }}
        placeholder="Filter by type..."
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
