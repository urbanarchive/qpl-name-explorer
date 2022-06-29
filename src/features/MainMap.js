import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import MONUMENT from '../models/monument';
import dasherize from '../utils/sluggify';
import Map from "../ui/Map";
import qplLogo from './images/qpl_logo.png';

const DUMMY_GEOJSON = { features: [], type: 'FeatureCollection' };

function MainMap({ monuments }) {
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
      'id': 'monuments',
      'type': 'symbol',
      'source': 'monuments',
      'layout': {
        'icon-image': 'qpl-logo',
        'icon-allow-overlap': true,
      },
      interactions: {
        hover: true,
        onClick(e) {
          const [feature] = e.features;
          const profileSegment = dasherize(feature.properties[MONUMENT.PLACE_NAME])
          const { id } = feature;

          navigate(`monuments/${profileSegment}-${id}`);
        },
      },
    });

    // for debugging the image symbol
    // mapInstance.addLayer({
    //   'id': 'monuments-circle',
    //   'type': 'circle',
    //   'source': 'monuments',
    //   'paint': {
    //     'circle-radius': 5,
    //     'circle-color': 'black',
    //   },
    // });
  }, [mapInstance]);

  useEffect(() => {
    if (monuments && mapInstance) {
      const monumentsSource = mapInstance.getSource('monuments');

      monumentsSource.setData(monuments);
    }
  }, [monuments, mapInstance]);

  return <Map
    onLoad={didLoad}
  />;
}

export default MainMap;
