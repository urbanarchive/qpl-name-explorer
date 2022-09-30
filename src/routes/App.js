import React, { useEffect, useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import Header from '../ui/Header';
import MainMap from '../features/MainMap';
import Detail from './Detail';
import Search from './Search';
import Splash from './Splash';

export const MapContext = createContext();

function App() {
  const [monuments, setData] = useState();
  const [mapInstance, setMapInstance] = useState(null);
  const [setResultListViewState] = useState(true);
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
        <Header monuments={monuments}/>
        <div className="flex h-full overflow-scroll relative">
          <MainMap monuments={monuments} onLoad={setMapInstance} />
          <div className="flex absolute top-0 z-100 h-full w-full overflow-scroll pointer-events-none">
            <div className="lg:basis-1/3 sm:m-5 md:basis-1/2 overflow-scroll bg-white rounded-lg pointer-events-auto shadow-2xl" {...handlers}>
              <Routes>
                <Route path="/" element={<Splash/>} />
                <Route path="/monuments" element={<Search monuments={monuments} />} />
                <Route path="/monuments/:slug" element={monuments?.features && <Detail monuments={monuments} />} />
                <Route path="/tours/:slug" element={monuments?.features && <Detail monuments={monuments}></Detail>} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </MapContext.Provider>
  );
}

export default App;
