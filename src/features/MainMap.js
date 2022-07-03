import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import bbox from '@turf/bbox';
import MONUMENT from '../models/monument';
import sluggify from '../utils/sluggify';
import Map from "../ui/Map";
import qplLogo from './images/qpl_logo.png';

const DUMMY_GEOJSON = { features: [], type: 'FeatureCollection' };
export const MONUMENT_TYPES = [
  // TODO: make hex
  'Building', 'purple',
  'Street/Thoroughfare', 'gray',
  'School', 'pink',
  'Park/Playground', 'green',
  'Monument/Statue', 'blue',
  'Library', 'red',
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
          const profileSegment = sluggify(feature.properties)
          const { id } = feature;

          navigate(`monuments/${profileSegment}-${id}`);
        },
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapInstance]);

  useEffect(() => {
    if (monuments && mapInstance) {
      const monumentsSource = mapInstance.getSource('monuments');

      monumentsSource.setData(monuments);

      onLoad(mapInstance);
    }
  }, [monuments, mapInstance]);

  return <>
    {monuments && <Map
      onLoad={didLoad}
      bounds={bbox(monuments)}
    />}
  </>;
}

export default MainMap;
