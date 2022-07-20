import React, { useEffect, useState } from 'react';
import mapLayers from '../features/images/map-layers.png';
import Toggle from '../ui/Toggle';

function getVisibility(state) {
  if (state === undefined) return 'visible';
  return state ? 'visible' : 'none';
}

export default function SupportingLayers({ map }) {
  const [supportingLayersToggleVisible, setVisibility] = useState(false);
  const [layersState, setLayerState] = useState({
    cds: false,
    ntas: false,
  });

  useEffect(() => {
    async function fetchData() {
      const data = {
        cds: await (await fetch('/data/static/cds.geojson')).json(),
        ntas: await (await fetch('/data/static/ntas.geojson')).json(),
      };
  
      map.addSource('supporting-cds', {
        type: 'geojson',
        data: data.cds,
      });

      map.addSource('supporting-ntas', {
        type: 'geojson',
        data: data.ntas,
      });

      map.addLayer({
        id: 'supporting-cds',
        source: 'supporting-cds',
        type: 'line',
        paint: {
          "line-color": "#527a00",
          "line-opacity": 0.8,
          "line-width": {
            "stops": [[11, 1], [16, 3]],
          },
        },
        layout: {
          'visibility': getVisibility(layersState.cds),
        },
      });

      map.addLayer({
        id: 'supporting-ntas',
        source: 'supporting-ntas',
        type: 'line',
        paint: {
          'line-color': '#00007a',
          'line-opacity': 0.6,
          'line-width': {
            stops: [[11, 1], [16, 3]]
          }
        },
        layout: {
          'line-join': 'round',
          'line-cap': 'round',
          'visibility': getVisibility(layersState.ntas),
        }
      })

      map.addLayer({
        id: 'supporting-cds-labels',
        source: 'supporting-cds',
        type: 'symbol',
        minzoom: 11,
        paint: {
          'text-color': '#626262',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2,
          'text-halo-blur': 2
        },
        layout: {
          'text-field': "{BoroCD}",
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-size': {
            stops: [[11, 12], [14, 16]]
          },
          'visibility': getVisibility(layersState.cds),
        }
      });

      map.addLayer({
        id: 'supporting-ntas-labels',
        source: 'supporting-ntas',
        type: 'symbol',
        minzoom: 11,
        paint: {
          'text-color': '#626262',
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2,
          'text-halo-blur': 2
        },
        layout: {
          'text-field': "{NTAName}",
          'text-font': [
            'Open Sans Semibold',
            'Arial Unicode MS Bold'
          ],
          'text-size': {
            stops: [[11, 12], [14, 16]]
          },
          'visibility': getVisibility(layersState.ntas),
        }
      });
    }
  
    fetchData();

    return () => {
      map.removeLayer('supporting-cds');
      map.removeLayer('supporting-ntas');
      map.removeLayer('supporting-cds-labels');
      map.removeLayer('supporting-ntas-labels');
      map.removeSource('supporting-cds');
      map.removeSource('supporting-ntas');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (map && map.getSource('supporting-cds') && map.getSource('supporting-ntas')) {
      map.setLayoutProperty('supporting-cds', 'visibility', getVisibility(layersState.cds));
      map.setLayoutProperty('supporting-ntas', 'visibility', getVisibility(layersState.ntas));
      map.setLayoutProperty('supporting-cds-labels', 'visibility', getVisibility(layersState.cds));
      map.setLayoutProperty('supporting-ntas-labels', 'visibility', getVisibility(layersState.ntas));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersState])

  return <div
    className='absolute bottom-0 right-0 m-8 p-2 bg-white rounded-lg shadow cursor-pointer'
    onMouseOver={() => { setVisibility(true) }}
    onMouseLeave={() => { setVisibility(false) }}
  >
    {!supportingLayersToggleVisible && <div>
      <img src={mapLayers} alt="supporting layers" className='w-8 h-8' />
    </div>}
    {supportingLayersToggleVisible && <div className='whitespace-pre-line'>
      <ul>
        <li onClick={() => setLayerState({...layersState, ntas: !layersState.ntas })}>
          <Toggle
            checked={layersState.ntas}
          >
            Neighborhoods
          </Toggle>
        </li>
        <li onClick={() => setLayerState({...layersState, cds: !layersState.cds })}>
          <Toggle
            checked={layersState.cds}
          >
            Community Districts
          </Toggle>
        </li>
      </ul>
    </div>}
  </div>;
}
