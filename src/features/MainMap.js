import Map from "../ui/Map";
import qplLogo from './images/qpl_logo.png';

function MainMap() {
  // TODO: hot reloading not supported
  const didLoad = (map) => {
    map.loadImage(qplLogo, (error, image) => {
      map.addImage('qpl-logo', image);
      map.addSource('monuments', {
        type: 'geojson',
        data: '/data/monuments.geojson',
      });
      map.addLayer({
        'id': 'monuments',
        'type': 'symbol',
        'source': 'monuments',
        'layout': {
          'icon-image': 'qpl-logo',
        }
      });
    });
  };

  return <Map
    onLoad={didLoad}
  />;
}

export default MainMap;
