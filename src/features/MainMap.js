import React, { createRef, useEffect, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import bbox from '@turf/bbox';
import ReactDOM from "react-dom";
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import SupportingLayers from './SupportingLayers';
import LOCATION from '../models/location';
import Map from "../ui/Map";
import { getIconFromMonumentType, ICONS_BY_SIMPLIFIED_NAME } from '../models/location';
import { resultFactory } from '../models/location';
import ICONS from './images/icons';
import toFlattenedArray from '../utils/to-flattened-array';

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

export const Marker = ({ children, feature, ...props }) => {
  const icon = getIconFromMonumentType(feature.properties);

  return (
    <SimpleMarker
      src={icon}
      alt='icon'
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
  const tooltipRef = useRef(new mapboxgl.Popup({
    closeButton: false,
    closeOnClick: false,
    offset: 15,
  }));

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

      mapInstance.addSource('qpl-locations', {
        type: 'geojson',
        data: uniqueLocations,
      });

      mapInstance.addLayer({
        'id': 'qpl-locations-markers',
        'source': 'qpl-locations',
        'type': 'symbol',
        'layout': {
          'icon-image': [
            'match',
            ['get', LOCATION.TYPE],
            ...toFlattenedArray(ICONS_BY_SIMPLIFIED_NAME),
            /* other */ 'other'
          ],
          'icon-size': ['match', ['get', 'id'], 0, 0.8, 0.5],
          'icon-allow-overlap': true,
        },
      });

      let hovered = null;

      mapInstance.on('mousemove', (e) => {
        var features = mapInstance.queryRenderedFeatures(e.point, { layers: ['qpl-locations-markers'] });

        if (!features.length) {
          mapInstance.getCanvas().style.cursor = 'cursor';
          mapInstance.setLayoutProperty(
            'qpl-locations-markers', 'icon-size', ['match', ['get', 'id'], 0, 0.8, 0.5]
          );
          hovered = null;
          tooltipRef.current.remove();
          return;
        }

        mapInstance.getCanvas().style.cursor = 'pointer';

        hovered = features[0];
        mapInstance.setLayoutProperty(
          'qpl-locations-markers', 'icon-size', ['match', ['get', 'id'], hovered.properties.id, 0.8, 0.5]
        );
        mapInstance.getCanvasContainer().style.cursor = 'pointer';

        // Populate the popup and set its coordinates
        // based on the feature found.
        const popupNode = document.createElement("div");
        ReactDOM.render(
          <h3 className='text-md'>{hovered.properties[LOCATION.PLACE_NAME]}</h3>,
          popupNode
        );

        tooltipRef.current
          .setLngLat(e.lngLat)
          .setDOMContent(popupNode)
          .addTo(mapInstance)
      });

      mapInstance.on('click', (e) => {
        if (hovered) {
          handleClick(hovered);
        }
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
