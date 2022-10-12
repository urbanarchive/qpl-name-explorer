import React from 'react'
import LOCATION from '../models/location';
import ListResult from '../ui/ListResult';

function Splash({ locations = [] }) {
  const latestLocations = locations.features.sort((a, b) => a[LOCATION.SUBMITTED_AT] > b[LOCATION.SUBMITTED_AT]);

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
    {/* <Link to='/locations'>
      <button className='mt-4 w-full p-2 bg-blue-500 rounded-md text-white'>
        Start Exploring
      </button>
    </Link> */}
    <h2 className='text-sm my-4 mt-8 font-bold'>The Latest</h2>
    <div className='flex flex-col gap-4'>
      {latestLocations.slice(0,30).map((location, index) => <ListResult key={index} result={location} />)}
    </div>
  </div>
}

export default Splash;
