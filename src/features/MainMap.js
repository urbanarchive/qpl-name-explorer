import React, { createRef, useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import bbox from '@turf/bbox';
import ReactDOM from "react-dom";
import ReactTooltip from 'react-tooltip';
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import SupportingLayers from './SupportingLayers';
import LOCATION from '../models/location';
import Map from "../ui/Map";
import { getIconFromMonumentType } from '../models/location';
import { resultFactory } from '../models/location';
import ICONS from './images/icons';

export const SelectedIconMarker = ({ width, height, children, ...props }) => <SimpleMarker
  src={ICONS['selected']}
  {...props}
>
  {children}
</SimpleMarker>;

export const SimpleMarker = ({ src, className = '', children, ...props }) => {
  return (<div>
    <img
      src={src}
      alt="map marker"
      className={`marker cursor-pointer opacity-85 hover:scale-125 duration-100 ${className}`}
      {...props}
    />
    {children}
  </div>);
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

function MainMap({ locations, onLoad }) {
  const navigate = useNavigate();
  const [mapInstance, setMapInstance] = useState();

  const didLoad = (map) => {
    setMapInstance(map);
  };

  const handleClick = (feature) => {
    const { properties: { [LOCATION.COORDS]: coords, [LOCATION.TYPE]: type, IS_UNIQUE } } = feature;

    if (type === 'Library') {
      return;
    }

    if (IS_UNIQUE) {
      const result = resultFactory(feature);

      navigate(`/locations/${result.slug}?mode=list`);

      return;
    }

    navigate(`/locations?key=${LOCATION.COORDS}&value=${coords}`);
  };

  useEffect(() => {
    if (!mapInstance) return;
  }, [mapInstance]);

  useEffect(() => {
    if (locations && mapInstance) {
      const uniqueLocations = {
        type: 'FeatureCollection',
        features: locations.features
          .filter((m, index, array) => {
            return m.properties[LOCATION.IS_PRIMARY] || m.properties.IS_UNIQUE;
          })
          // surface non-library icons
          .sort((a, b) => {
            if (a.properties[LOCATION.TYPE] === 'Library') {
              return -1;
            }

            return 1;
          }),
      };

      // markers
      uniqueLocations.features.forEach(f => {
        const isInteractive = f.properties[LOCATION.TYPE] === 'Library';
        addMapboxMarker(<Marker
            onClick={handleClick}
            feature={f}
            className={`w-6 h-6 ${isInteractive ? 'cursor-grab' : ''}`}
          />, f.geometry.coordinates, mapInstance);
      });

      // tooltips
      uniqueLocations.features.forEach(feature => {
        const ref = createRef();
        ref.current = document.createElement("div");
        const location = resultFactory(feature);

        ReactDOM.render(<ReactTooltip
            className='whitespace-nowrap'
            id={feature.properties.id}
          >
            <h3 className='text-3xl]'>{feature.properties[LOCATION.PLACE_NAME]}</h3>
            {location.hasImage && <img src={location.thumbnail} alt='hoverable thumbnail'/>}
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
  }, [locations, mapInstance]);

  return <>
    {locations && <Map
      onLoad={didLoad}
      bounds={bbox(locations)}
    />}
    {mapInstance && <SupportingLayers map={mapInstance} />}
  </>;
}

export default MainMap;
