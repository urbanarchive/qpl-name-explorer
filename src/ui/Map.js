import React, { useEffect, useRef } from 'react'
// eslint-disable-next-line import/no-webpack-loader-syntax
import mapboxgl from '!mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'pk.eyJ1IjoidXJiYW5hcmNoaXZlIiwiYSI6ImNrejcxYXJ5ODE1bDUybm5rdmlsODFldm8ifQ.zSi--O2cC3BcCW5ZUZuD3w';

class ThematicMap extends mapboxgl.Map {
  addLayer(...args) {
    const [{ id, interactions }] = args;

    if (interactions && interactions.hover) {
      this.on('mouseenter', id, () => {
        this.getCanvas().style.cursor = 'pointer'
      });

      this.on('mouseleave', id, () => {
        this.getCanvas().style.cursor = ''
      });
    }

    if (interactions && interactions.onClick) {
      this.on('click', id, interactions.onClick);
    }

    return super.addLayer(...args);
  }
}

function Map({
  bounds,
  onLoad = () => {},
}) {
  // this ref holds the map DOM node so that we can pass it into Mapbox GL
  const mapNode = useRef(null);

  // instantiate the map, add sources and layers, event listeners, tooltips
  useEffect(() => {
    const map = new ThematicMap({
      container: mapNode.current,
      style: 'mapbox://styles/urbanarchive/ckgji5x1r2v5619q7z5eezlv6',
      ...bounds ? { bounds } : {
        zoom: 11,
        center: [-73.9579, 40.7333],
      },
    });

    map.on('load', () => {
      onLoad(map);

      window.map = map; // for easier debugging and querying via console
    });

    return () => {
      map.remove();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className='map-container z-0'
      ref={mapNode}
    />
  );
};

export default Map;
