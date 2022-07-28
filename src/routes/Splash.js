import React from 'react'
import { Link } from 'react-router-dom';

function Splash() {
  return <div className='p-4'>
    <h1 className='text-3xl pb-4 font-feather uppercase'>
      Queens Name Explorer
    </h1>
    <p className='font-light text-sm'>
      Queens Public Library honors the people we serve in the most diverse place in the country and uphold our commitment to inclusion, equity, and free access to information and opportunity for all. We celebrate the Library's rich past and promising future in building resilience and unity in our communities, and as a force for truth and democracy. Click on the pins on the map to see current and past QPL locations and stories submitted by patrons.
    </p>
    <Link to='/monuments'>
      <button className='mt-4 w-full p-2 bg-blue-500 rounded-md text-white'>
        Start Exploring
      </button>
    </Link>
  </div>
}

export default Splash;
