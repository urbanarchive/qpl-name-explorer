import React, { useState, createContext } from 'react'
import { Routes, Route } from 'react-router-dom';
import { useSwipeable } from 'react-swipeable';
import useSWR from 'swr'
import Header from '../ui/Header';
import MainMap from '../features/MainMap';
import Detail from './Detail';
import Search from './Search';
import Splash from './Splash';

export const MapContext = createContext();
const fetcher = (...args) => fetch(...args).then(res => res.json());

function App() {
  const [mapInstance, setMapInstance] = useState(null);
  const [setResultListViewState] = useState(true);
  const handlers = useSwipeable({
    onSwipedUp: (eventData) => setResultListViewState(false),
    onSwipedDown: (eventData) =>  setResultListViewState(true),
    swipeDuration: 250,
  });

  const { data: locations } = useSWR('/data/monuments.geojson', fetcher);

  if (!locations) return 'Loading...';

  return (
    <MapContext.Provider value={mapInstance}>
      <div className="flex flex-col h-full w-full max-h-screen">
        <Header locations={locations}/>
        <div className="flex h-full overflow-scroll relative">
          <MainMap locations={locations} onLoad={setMapInstance} />
          <div className="flex absolute top-0 z-100 h-full w-full overflow-scroll pointer-events-none">
            <div className="lg:basis-1/3 sm:m-5 md:basis-1/2 overflow-scroll bg-white rounded-lg pointer-events-auto shadow-2xl" {...handlers}>
              <Routes>
                <Route path="/" element={<Splash/>} />
                <Route path="/locations" element={<Search locations={locations} />} />
                <Route path="/locations/:slug" element={locations?.features && <Detail locations={locations} />} />
                <Route path="/tours/:slug" element={locations?.features && <Detail locations={locations}></Detail>} />
              </Routes>
            </div>
          </div>
        </div>
      </div>
    </MapContext.Provider>
  );
}

export default App;
