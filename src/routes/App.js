import React, { useEffect, useState, createContext, useRef, useCallback } from 'react'
import { Routes, Route } from 'react-router-dom';
import { isMobile } from 'react-device-detect';
import Header from '../ui/Header';
import MainMap from '../features/MainMap';
import Detail from './Detail';
import List from './Search';

export const MapContext = createContext();

function App() {
  const [monuments, setData] = useState();
  const [mapInstance, setMapInstance] = useState(null);
  const [resultListViewState, setResultListViewState] = useState(true);
  const scrollableFrame = useRef(null);

  // get all monuments
  useEffect(() => {
    async function fetchData() {
      const data = await (await fetch('/data/monuments.geojson')).json();

      setData(data);
    }

    fetchData();
  }, []);

  const [y, setY] = useState(null);
  const handleNavigation = useCallback(
    (e) => {
      const window = e.currentTarget;

      if (y > window.scrollTop) {
        // up
        setResultListViewState(true);
      } else if (y < window.scrollTop) {
        // down
        setResultListViewState(false);
      }
      setY(window.scrollTop);
    },
    [y]
  );

  useEffect(() => {
    setY(scrollableFrame.current?.scrollTop);
    scrollableFrame.current?.addEventListener("scroll", handleNavigation);

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      scrollableFrame.current?.removeEventListener("scroll", handleNavigation);
    };
  }, [handleNavigation, scrollableFrame]);

  return (
    <MapContext.Provider value={mapInstance}>
      <div className="flex flex-col h-full w-full max-h-screen">
        <div className="flex flex-col sm:flex-row h-full overflow-scroll">
          {isMobile && <Header/>}
          <div className={`${resultListViewState ? 'basis-3/5' : 'basis-1/5'} relative`}>
            <MainMap monuments={monuments} onLoad={setMapInstance} />
          </div>
          <div className={`${resultListViewState ? 'basis-2/5' : 'basis-4/5'} ease-linear max-h-full overflow-scroll`} ref={scrollableFrame}>
            {(!isMobile) && <Header/>}
            <Routes>
              <Route path="/" element={<List monuments={monuments} />} />
              <Route path="/monuments/:slug" element={<Detail />} />
            </Routes>
          </div>
        </div>
      </div>
    </MapContext.Provider>
  );
}

export default App;
