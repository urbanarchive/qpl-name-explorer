import React, { useState, createContext, useRef, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom';
import useSWR from 'swr'
import Header from '../ui/Header';
import MainMap from '../features/MainMap';
import Detail from './Detail';
import Search from './Search';
import Splash from './Splash';

export const MapContext = createContext();
const fetcher = (...args) => fetch(...args).then(res => res.json());

function App() {
  const contentRef = useRef(null);
  const { pathname } = useLocation();
  const [mapInstance, setMapInstance] = useState(null);
  const { data: locations } = useSWR('/data/monuments.geojson', fetcher);

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [pathname])

  if (!locations) return 'Loading...';

  return (
    <MapContext.Provider value={mapInstance}>
      <div className="flex flex-col h-full w-full max-h-screen">
        <Header locations={locations}/>
        <div className="flex h-full overflow-scroll relative">
          <MainMap locations={locations} onLoad={setMapInstance} />
          <div className="flex absolute top-0 z-100 h-full w-full overflow-scroll pointer-events-none">
            <div ref={contentRef} className="lg:basis-1/3 sm:m-5 md:basis-1/2 overflow-scroll bg-white rounded-lg pointer-events-auto shadow-2xl">
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
