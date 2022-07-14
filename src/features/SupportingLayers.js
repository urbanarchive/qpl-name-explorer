import React, { useEffect } from 'react';

export default function SupportingLayers({ map }) {
  useEffect(() => {
    async function fetchData() {
      const data = {
        cds: await (await fetch('/data/static/cds.geojson')).json(),
        ntas: await (await fetch('/data/static/ntas.geojson')).json(),
      };
  
      // setData(data);
      map.addSource('supporting-cds', {
        type: 'geojson',
        data: data.cds,
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
      });

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
          }
        }
      })
    }
  
    fetchData();

    return () => {
      map.removeLayer('supporting-cds');
      map.removeSource('supporting-cds');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
