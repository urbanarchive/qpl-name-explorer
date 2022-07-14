import React, { useEffect, useState } from 'react';

export default function SupportingLayers({ map }) {
  const [, setData] = useState();

  useEffect(() => {
    async function fetchData() {
      const data = {
        cds: await (await fetch('/data/static/cds.geojson')).json(),
        ntas: await (await fetch('/data/static/ntas.geojson')).json(),
      };
  
      setData(data);
    }
  
    fetchData();
  }, []);

  return <></>;
}
