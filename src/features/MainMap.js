import React, { createRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import bbox from '@turf/bbox';
import ReactDOM from "react-dom";
import ReactTooltip from 'react-tooltip';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import SupportingLayers from './SupportingLayers';
import MONUMENT from '../models/monument';
import Map from "../ui/Map";
import { getIconFromMonumentType } from '../models/monument';
import { resultFactory } from '../models/monument';

export const SimpleMarker = ({ src, className, ...props }) => {
  return (
    <img
      src={src}
      alt="map marker"
      className={`marker cursor-pointer w-6 h-6 opacity-85 hover:scale-125 duration-100 ${className}`}
      {...props}
    />
  );
}

export const Marker = ({ onClick, children, feature, ...props }) => {
  const _onClick = () => {
    onClick(feature);
  };
  const icon = getIconFromMonumentType(feature.properties);

  return (
    <SimpleMarker
      src={icon}
      alt='icon'
      onClick={_onClick}
      data-tip
      data-for={feature.properties.id}
      {...props}
    />
  );
};

export const addMapboxMarker = (markerComponent, loc, map, options = {}) => {
  const ref = createRef();
  ref.current = document.createElement("div");

  // Render a Marker Component on our new DOM node
  ReactDOM.render(
    markerComponent,
    ref.current
  );

  return new mapboxgl.Marker({ element: ref.current, ...options })
    .setLngLat(loc)
    .addTo(map);
}

function MainMap({ monuments, onLoad }) {
  const navigate = useNavigate();
  const [mapInstance, setMapInstance] = useState();

  const didLoad = (map) => {
    setMapInstance(map);
  };

  const handleClick = (feature) => {
    const { properties: { [MONUMENT.COORDS]: coords, [MONUMENT.TYPE]: type, IS_UNIQUE } } = feature;

    if (type === 'Library') {
      return;
    }

    if (IS_UNIQUE) {
      const result = resultFactory(feature);

      navigate(`/monuments/${result.slug}`);

      return;
    }

    navigate(`/monuments?key=${MONUMENT.COORDS}&value=${coords}`);
  };

  useEffect(() => {
    if (!mapInstance) return;
  }, [mapInstance]);

  useEffect(() => {
    if (monuments && mapInstance) {
      const uniqueLocations = {
        type: 'FeatureCollection',
        features: monuments.features
          .filter((m, index, array) => {
            return m.properties[MONUMENT.IS_PRIMARY] || m.properties.IS_UNIQUE;
          })
          // surface non-library icons
          .sort((a, b) => {
            if (a.properties[MONUMENT.TYPE] === 'Library') {
              return -1;
            }

            return 1;
          }),
      };

      // markers
      uniqueLocations.features.forEach(f => {
        const isInteractive = f.properties[MONUMENT.TYPE] === 'Library';
        addMapboxMarker(<Marker
            onClick={handleClick}
            feature={f}
            {...{ className: isInteractive ? 'cursor-grab' : '' }}
          />, f.geometry.coordinates, mapInstance);
      });

      // tooltips
      uniqueLocations.features.forEach(feature => {
        const ref = createRef();
        ref.current = document.createElement("div");
        
        ReactDOM.render(<ReactTooltip
            className='whitespace-nowrap'
            id={feature.properties.id}
          >
            <h3 className='font-feather text-lg]'>{feature.properties[MONUMENT.PLACE_NAME]}</h3>
          </ReactTooltip>,
          ref.current
        );
        new mapboxgl.Marker(ref.current)
          .setLngLat(feature.geometry.coordinates)
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
    {mapInstance && <SupportingLayers map={mapInstance} />}
  </>;
}

export default MainMap;
