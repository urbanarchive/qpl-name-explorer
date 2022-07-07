import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import bbox from '@turf/bbox';
import MONUMENT from '../models/monument';
import Map from "../ui/Map";
import qplLogo from './images/qpl_logo.png';

const DUMMY_GEOJSON = { features: [], type: 'FeatureCollection' };
export const MONUMENT_TYPES = [
  // TODO: make hex
  'Building', '#B973F5',
  'Street/Thoroughfare', '#777777',
  'School', '#B973F5',
  'Park/Playground', '#00AC4F',
  'Monument/Statue', '#0094FF',
  'Library', '#6E2991',
  /* other */ 'orange',
];

function MainMap({ monuments, onLoad }) {
  const navigate = useNavigate();
  const [mapInstance, setMapInstance] = useState();
  const didLoad = (map) => {
    setMapInstance(map);
  };

  useEffect(() => {
    if (!mapInstance) return;

    mapInstance.loadImage(qplLogo, (error, image) => {
      mapInstance.addImage('qpl-logo', image);
    });

    mapInstance.addSource('monuments', {
      type: 'geojson',
      data: DUMMY_GEOJSON,
      promoteId: 'id',
    });

    mapInstance.addLayer({
      'id': 'monuments-circle',
      'type': 'circle',
      'source': 'monuments',
      'paint': {
        'circle-radius': 5,
        'circle-color': [
          'match',
          ['get', MONUMENT.TYPE],
          ...MONUMENT_TYPES
        ],
      },

      // TODO: use symbolized icon assets
      // 'id': 'monuments',
      // 'type': 'symbol',
      // 'source': 'monuments',
      // 'layout': {
      //   'icon-image': 'qpl-logo',
      //   'icon-allow-overlap': true,
      // },

      interactions: {
        hover: true,
        onClick(e) {
          const [feature] = e.features;
          const { properties: { [MONUMENT.COORDS]: coords } } = feature;

          navigate(`/?key=${MONUMENT.COORDS}&value=${coords}`);
        },
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance]);

  useEffect(() => {
    if (monuments && mapInstance) {
      const uniqueLocations = {
        type: 'FeatureCollection',
        features: monuments.features.filter(m => m.properties[MONUMENT.IS_PRIMARY]),
      };
      const monumentsSource = mapInstance.getSource('monuments');

      monumentsSource.setData(uniqueLocations);

      onLoad(mapInstance);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monuments, mapInstance]);

  return <>
    {monuments && <Map
      onLoad={didLoad}
      bounds={bbox(monuments)}
    />}
  </>;
}

export default MainMap;
