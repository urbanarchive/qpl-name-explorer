import React from 'react'
import { Link } from 'react-router-dom';

function Splash() {
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
    <Link to='/locations'>
      <button className='mt-4 w-full p-2 bg-blue-500 rounded-md text-white'>
        Start Exploring
      </button>
    </Link>
  </div>
}

export default Splash;
