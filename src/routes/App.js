import React, { useEffect, useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import { useSwipeable } from 'react-swipeable';
import Header from '../ui/Header';
import MainMap from '../features/MainMap';
import Detail from './Detail';
import Search from './Search';

export const MapContext = createContext();

function App() {
  const [monuments, setData] = useState();
  const [mapInstance, setMapInstance] = useState(null);
  const [resultListViewState, setResultListViewState] = useState(true);
  const handlers = useSwipeable({
    onSwipedUp: (eventData) => setResultListViewState(false),
    onSwipedDown: (eventData) =>  setResultListViewState(true),
    swipeDuration: 250,
  });

  // get all monuments
  useEffect(() => {
    async function fetchData() {
      const data = await (await fetch('/data/monuments.geojson')).json();

      setData(data);
    }

    fetchData();
  }, []);

  return (
    <MapContext.Provider value={mapInstance}>
      <div className="flex flex-col h-full w-full max-h-screen">
        <div className="flex flex-col sm:flex-row h-full overflow-scroll">
          {isMobile && <Header monuments={monuments}/>}
          <div className={`${resultListViewState ? 'basis-3/5' : 'basis-1/5'} relative`}>
            <MainMap monuments={monuments} onLoad={setMapInstance} />
          </div>
          <div className={`${resultListViewState ? 'basis-2/5' : 'basis-4/5'} ease-linear max-h-full overflow-scroll`} {...handlers}>
            {(!isMobile) && <Header monuments={monuments}/>}
            <Routes>
              <Route path="/" element={<Search monuments={monuments} />} />
              <Route path="/monuments/:slug" element={monuments?.features && <Detail monuments={monuments} />} />
            </Routes>
          </div>
        </div>
      </div>
    </MapContext.Provider>
  );
}

export default App;
