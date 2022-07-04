import React from 'react'
import { Link } from 'react-router-dom';
import qplLogo from '../features/images/qpl_logo.png';


function Header() {
  return <>
    <div className="flex gap-4 p-4">
      <Link to="/" className="flex w-10 h-8 items-center">
        <img className='w-8 h-8 bg-red-100 p-1 rounded-md' src={qplLogo} alt="QPL Logo" />
      </Link>
      <div className="grow h-8">
        <input className='w-full h-full bg-gray-200 rounded-md p-2' type="text" placeholder='Search QPL Stories'></input>
      </div>
      <div className="flex w-16 h-8 items-center justify-center">
        <div className='flex items-center justify-center h-8 bg-purple-600 p-2 rounded-3xl text-white'>Log In</div>
      </div>
    </div>
  </>
}

export default Header;
