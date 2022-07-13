import React, { createRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import bbox from '@turf/bbox';
import ReactDOM from "react-dom";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import MONUMENT from '../models/monument';
import Map from "../ui/Map";
import ICONS from './images/icons';

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

export const ICONS_BY_MONUMENT_TYPE = {
  'Building': ICONS['building'],
  'Street/Thoroughfare': ICONS['street'],
  'School': ICONS['school'],
  'Park/Playground': ICONS['park'],
  'Monument/Statue': ICONS['monument'],
  'Library': ICONS['library'],
};

const Marker = ({ onClick, children, feature }) => {
  const _onClick = () => {
    onClick(feature);
  };
  const icon = ICONS_BY_MONUMENT_TYPE[feature.properties[MONUMENT.TYPE]] || ICONS['library'];

  return (
    <img
      src={icon}
      alt='icon'
      onClick={_onClick}
      className="marker cursor-pointer w-6 h-6 opacity-85"
    />
  );
};

function MainMap({ monuments, onLoad }) {
  const navigate = useNavigate();
  const [mapInstance, setMapInstance] = useState();
  const didLoad = (map) => {
    setMapInstance(map);
  };
  const handleClick = (feature) => {
    const { properties: { [MONUMENT.COORDS]: coords } } = feature;

    navigate(`/?key=${MONUMENT.COORDS}&value=${coords}`);
  };

  useEffect(() => {
    if (!mapInstance) return;
  }, [mapInstance]);

  useEffect(() => {
    if (monuments && mapInstance) {
      const uniqueLocations = {
        type: 'FeatureCollection',
        features: monuments.features
          .filter(m => m.properties[MONUMENT.IS_PRIMARY])
          // surface non-library icons
          .sort((a, b) => {
            if (a.properties[MONUMENT.TYPE] === 'Library') {
              return -1;
            }

            return 1;
          }),
      };

      uniqueLocations.features.forEach(f => {
        const ref = createRef();
        ref.current = document.createElement("div");

        // Render a Marker Component on our new DOM node
        ReactDOM.render(
          <Marker onClick={handleClick} feature={f} />,
          ref.current
        );

        new mapboxgl.Marker(ref.current)
          .setLngLat(f.geometry.coordinates)
          .addTo(mapInstance);
      });

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
