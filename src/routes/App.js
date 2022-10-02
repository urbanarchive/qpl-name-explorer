import React, { useState, createContext, useRef, useEffect } from 'react'
import { Routes, Route, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [params, setSearchParams] = useSearchParams();
  const { pathname } = useLocation();
  const [mapInstance, setMapInstance] = useState(null);
  const [mode, setMode] = useState(params.get('mode'));
  const { data: locations } = useSWR('/data/monuments.geojson', fetcher);
  const navigate = useNavigate();
  const isMapMode = mode === 'map';

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [pathname])

  if (!locations) return 'Loading...';

  return (
    <div className="flex flex-col h-full w-full max-h-screen">
      <Header locations={locations}/>
      <div className="flex h-full relative">
        <MapContext.Provider value={mapInstance}>
          <section className='flex h-full w-full'>
            <MainMap
              locations={locations}
              onLoad={setMapInstance}
            />
            <div className='sm:hidden absolute bottom-0 flex justify-center w-full z-10 pointer-events-none'>
              <div
                className='pointer-events-all p-4 m-4 bg-white drop-shadow-xl h-auto rounded-full text-sm cursor-pointer pointer-events-auto hover:border-qpl-purple border-2 opacity-95'
                onClick={() => setMode(isMapMode ? 'list' : 'map')}
              >
                {isMapMode ? 'List' : 'Map'}
              </div>
            </div>
          </section>
          <section className="flex absolute top-0 z-100 h-full w-full pointer-events-none">
            <div
              ref={contentRef}
              className={`${isMapMode && 'sm:block hidden'} basis-full lg:basis-1/3 sm:m-5 md:basis-1/2 overflow-scroll bg-white sm:opacity-100 opacity-90 rounded-lg pointer-events-auto shadow-2xl`}
            >
              <Routes>
                <Route path="/" element={<Splash/>} />
                <Route path="/locations" element={<Search locations={locations} />} />
                <Route path="/locations/:slug" element={locations?.features && <Detail locations={locations} />} />
                <Route path="/tours/:slug" element={locations?.features && <Detail locations={locations}></Detail>} />
              </Routes>
            </div>
            <div className={`hidden basis-2/3 flex justify-center p-5`}>
              <div>
                <div
                  className='p-4 bg-white drop-shadow-xl h-auto rounded-full text-sm cursor-pointer pointer-events-auto hover:border-qpl-purple border-2 opacity-95'
                  onClick={() => {
                    const bbox = mapInstance
                      .getBounds()
                      .toArray()
                      .reduce((acc, curr) => [...acc, ...curr], []);

                    navigate(`/locations?key=area&value=${bbox}`);
                  }}
                >
                  Search This Area
                </div>
              </div>
            </div>
          </section>
        </MapContext.Provider>
      </div>
    </div>
  );
}

export default App;
