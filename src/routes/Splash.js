import React, { useRef, useEffect, useState } from 'react'
import ListResult from '../ui/ListResult';
import { useOnScreen } from '../features/Tour';

const INCREMENT = 30;

const shuffleArray = array => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }

  return array;
}

function Splash({ locations = [] }) {
  const elementRef = useRef(null);
  const [visibleFeatures, updateVisibleFeatures] = useState(shuffleArray(locations.features.slice(0,30)));
  const endOfPageInView = useOnScreen(elementRef);

  useEffect(() => {
    if (endOfPageInView) {
      const currLength = visibleFeatures.length;
      updateVisibleFeatures([...visibleFeatures, ...locations.features.slice(currLength, currLength + INCREMENT)]);
    }
  }, [endOfPageInView, locations.features, visibleFeatures]);

  return <div className='p-4'>
    <h1 className='text-3xl pb-4 font-feather uppercase'>
      Queens Name Explorer
    </h1>
    <p className='font-light text-md'>
      This interactive map explores the individuals whose names grace public spaces across the borough of Queens. If you can add photos or additional information to the entries, or know of other named places we have not added yet to the map, please click the “Add/Edit” button to share what you know. Happy exploring!
    </p>
    <p className='font-light text-xs mt-2'>
      Major funding for the Queens Name Explorer project was provided by the <a href="https://mellon.org/" target="_blank" rel="noreferrer">Mellon Foundation</a>.
    </p>
    <h2 className='text-sm my-4 mt-8 font-bold'>The Latest</h2>
    <div className='flex flex-col gap-4'>
      {visibleFeatures
        .map((location, index) => <ListResult key={index} result={location} />)
      }
      <div ref={elementRef}></div>
    </div>
  </div>
}

export default Splash;
