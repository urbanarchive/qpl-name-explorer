const THEMATIC_LAYERS = [
  {
    groupId: 'cds',
    title: 'Community Districts',
    source: {
      data: '/data/static/cds.geojson',
      type: 'geojson',
    },
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
    }
  }, {
    groupId: 'ntas',
    title: 'Neighborhoods',
    source: {
      data: '/data/static/ntas.geojson',
      type: 'geojson',
    },
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
  }, {
    groupId: 'ccs',
    title: 'City Council Districts',
    source: {
      data: '/data/static/city_councils.geojson',
      type: 'geojson',
    },
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
          'text-field': "{CounDist}",
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
  }
];

// generates stable, consistent ids for use in mapbox-gl
const GENERATED_LAYERS = THEMATIC_LAYERS.map(thematicLayer => {
  const { layers, source, ...group } = thematicLayer;
  const sourceId = `supporting-${thematicLayer.groupId}`;

  const withClickableLayer = {
    clickableLayer: {
      source: sourceId,
      type: 'fill',
      paint: {
        'fill-opacity': 0,
      },
    },
    ...layers,
  };

  return {
    ...group,
    source: {
      id: sourceId,
      ...source,
    },
    layers: Object.values(withClickableLayer).map((layerConfiguration) => {
      const layerId = `${sourceId}-${layerConfiguration.type}`;

      return {
        id: layerId,
        source: sourceId,
        ...layerConfiguration,
        metadata: {
          group: thematicLayer.groupId,
        },
      };
    }),
  }
});

export function getVisibility(state) {
  if (state === undefined) return 'visible';
  if (typeof(state) === 'string') {
    return (state === 'visible') ? true : false;
  }

  return state ? 'visible' : 'none';
}

export default GENERATED_LAYERS;
