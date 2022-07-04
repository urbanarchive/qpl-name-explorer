import React, { useEffect, useState, createContext } from 'react'
import Header from '../ui/Header';
import MainMap from "../features/MainMap";
import { Routes, Route } from "react-router-dom";
import Detail from './Detail';
import List from './Search';

export const MapContext = createContext();

function App() {
  const [monuments, setData] = useState();
  const [mapInstance, setMapInstance] = useState(null);

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
          <div className="basis-3/5 relative">
            <MainMap monuments={monuments} onLoad={setMapInstance} />
          </div>
          <div className="basis-2/5 max-h-full overflow-scroll">
            <Header />
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
