import React, { useEffect, useState } from 'react';
import ICONS from './images/icons';
import Toggle from '../ui/Toggle';
import THEMATIC_LAYERS, { getVisibility } from '../utils/layer-configuration';

const mapLayers = ICONS['mapLayers'];

const DEFAULT_VISIBILITY_STATE = THEMATIC_LAYERS.reduce((acc, thematicLayer) => {
  return {
    // defaults to not visible... start here to make dynamic
    [thematicLayer.groupId]: false,
    ...acc,
  }
}, {});

export default function SupportingLayers({ map }) {
  const [supportingLayersToggleVisible, setVisibility] = useState(false);
  const [layersState, setLayerState] = useState(DEFAULT_VISIBILITY_STATE);

  useEffect(() => {
    THEMATIC_LAYERS.forEach(thematicLayer => {
      map.addSource(thematicLayer.source.id, {
        type: 'geojson',
        data: thematicLayer.source.data,
      });

      thematicLayer.layers.forEach(layer => {
        map.addLayer(layer);
        map.on('click', layer.id, (e) => {
          console.log(e);
        });
      });
    });

    return () => {
      THEMATIC_LAYERS.forEach(thematicLayers => {
        const { source: { id } } = thematicLayers;
        thematicLayers.layers.forEach(layer => {
          map.removeLayer(layer.id);
        });

        map.removeSource(id);
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isReady = THEMATIC_LAYERS.map(l => l.source.id).every(id => map?.getSource(id));

    if (map && isReady) {
      THEMATIC_LAYERS.forEach(thematicLayer => {
        thematicLayer.layers.forEach(l => {
          map.setLayoutProperty(l.id, 'visibility', getVisibility(layersState[l.metadata.group]));
        });
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layersState]);

  return <div
    className='absolute bottom-0 right-0 m-8 p-2 bg-white rounded-lg shadow cursor-pointer'
    onMouseOver={() => { setVisibility(true) }}
    onMouseLeave={() => { setVisibility(false) }}
  >
    {!supportingLayersToggleVisible && <div>
      <img src={mapLayers} alt="supporting layers" className='w-8 h-8' />
    </div>}
    {supportingLayersToggleVisible && <div className='whitespace-pre-line'>
      <ul>
        {THEMATIC_LAYERS.map(thematicLayer => {
          return <li
            key={thematicLayer.groupId}
            onClick={() => setLayerState({...layersState, [thematicLayer.groupId]: !layersState[thematicLayer.groupId] })}
          >
            <Toggle
              checked={layersState[thematicLayer.groupId]}
            >
              {thematicLayer.title}
            </Toggle>
          </li>})
        }
      </ul>
    </div>}
  </div>;
}
