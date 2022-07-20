import React, { useEffect, useState } from 'react';
import mapLayers from '../features/images/map-layers.png';
import Toggle from '../ui/Toggle';

function getVisibility(state) {
  if (state === undefined) return 'visible';
  if (typeof(state) === 'string') {
    return (state === 'visible') ? true : false;
  }

  return state ? 'visible' : 'none';
}

const THEMATIC_LAYERS = {
  cds: {
    title: 'Community Districts',
    data: '/data/static/cds.geojson',
    layers: {
      lines: {
        type: 'line',
        paint: {
          "line-color": "#527a00",
          "line-opacity": 0.8,
          "line-width": {
            "stops": [[11, 1], [16, 3]],
          },
        },
      },
      labels: {
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
        }
      },
    },
  },
  ntas: {
    title: 'Neighborhoods',
    data: '/data/static/ntas.geojson',
    layers: {
      lines: {
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
        }
      },
      labels: {
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
        }
      },
    },
  },
  ccs: {
    title: 'City Council Districts',
    data: '/data/static/city_councils.geojson',
    layers: {
      lines: {
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
        }
      },
    }
  },
};

const INITIAL_STATE = Object.entries(THEMATIC_LAYERS).reduce((acc, [key]) => {
  return {
    [key]: false,
    ...acc,
  }
}, {});

const GENERATED_LAYERS = Object.entries(THEMATIC_LAYERS).map(([groupKey, thematicLayer]) => {
  const { layers, ...sourceConfiguration } = thematicLayer;
  const sourceId = `supporting-${groupKey}`;

  return {
    source: {
      id: sourceId,
      ...sourceConfiguration,
    },
    layers: Object.values(layers).map((layerConfiguration) => {
      const layerId = `${sourceId}-${layerConfiguration.type}`;

      return {
        id: layerId,
        source: sourceId,
        ...layerConfiguration,
        metadata: {
          group: groupKey,
        },
      };
    }),
  }
});

export default function SupportingLayers({ map }) {
  const [supportingLayersToggleVisible, setVisibility] = useState(false);
  const [layersState, setLayerState] = useState(INITIAL_STATE);

  useEffect(() => {
    GENERATED_LAYERS.forEach(thematicLayer => {
      map.addSource(thematicLayer.source.id, {
        type: 'geojson',
        data: thematicLayer.source.data,
      });

      thematicLayer.layers.forEach(layer => {
        map.addLayer(layer);
      });
    });

    return () => {
      GENERATED_LAYERS.forEach(thematicLayers => {
        const { source: { id } } = thematicLayers;
        thematicLayers.layers.forEach(layer => {
          map.removeLayer(layer.id);
        });

        map.removeSource(id);
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isReady = GENERATED_LAYERS.map(l => l.source.id).every(id => map?.getSource(id));

    if (map && isReady) {
      GENERATED_LAYERS.forEach(source => {
        source.layers.forEach(l => {
          map.setLayoutProperty(l.id, 'visibility', getVisibility(layersState[l.metadata.group]));
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersState]);

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
        {Object.entries(THEMATIC_LAYERS).map(([sourceKey, source]) => {
          return <li
            key={sourceKey}
            onClick={() => setLayerState({...layersState, [sourceKey]: !layersState[sourceKey] })}
          >
            <Toggle
              checked={layersState[sourceKey]}
            >
              {source.title}
            </Toggle>
          </li>})
        }
      </ul>
    </div>}
  </div>;
}
