import React from 'react'
import { Link } from 'react-router-dom';

function Splash() {
  return <div className='p-4'>
    <h1 className='text-3xl pb-4 font-feather uppercase'>
      Queens Name Explorer
    </h1>
    <p className='font-light text-sm'>
      Welcome to the Queens Name Explorer! In partnership with Urban Archive, the Queens Memory Project presents this interactive map exploring the individuals whose names grace public spaces across the borough. We invite you to join us in finding streets, schools, parks, memorials, and other local spaces that are named after specific people–then learn about their historical significance or contributions to Queens. If you know of other named places we have not added yet to the map, please share a photo of the place and what you know about the individual it’s named after here. Happy exploring!
    </p>
    <Link to='/monuments'>
      <button className='mt-4 w-full p-2 bg-blue-500 rounded-md text-white'>
        Start Exploring
      </button>
    </Link>
  </div>
}

export default Splash;
