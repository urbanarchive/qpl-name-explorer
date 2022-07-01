import React, { useEffect, useState } from 'react'
import MainMap from "../features/MainMap";
import { Routes, Route } from "react-router-dom";
import Detail from './Detail';

function App() {
  const [monuments, setData] = useState();

  // get all monuments
  useEffect(() => {
    async function fetchData() {
      const data = await (await fetch('/data/monuments.geojson')).json();

      setData(data);
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-h-screen">
      <div className="flex flex-col sm:flex-row h-full overflow-scroll">
        <div className="basis-3/5 relative">
          <MainMap monuments={monuments} />
        </div>
        <div className="basis-2/5 max-h-full overflow-scroll">
          <Routes>
            <Route path="/" element={<>Welcome!</>} />
            <Route path="/monuments/:slug" element={<Detail />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
