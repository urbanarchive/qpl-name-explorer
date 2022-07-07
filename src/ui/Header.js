import React from 'react'
import { Link } from 'react-router-dom';
import qplLogo from '../features/images/qpl_logo.png';

function Header({ className }) {
  return <>
    <div className={`flex gap-4 p-4 ${className}`}>
      <Link to="/" className="flex w-10 h-8 items-center">
        <img className='w-8 h-8 bg-red-100 p-1 rounded-md' src={qplLogo} alt="QPL Logo" />
      </Link>
      <div className="grow h-8">
        <input className='w-full h-full bg-gray-200 rounded-md p-2' type="text" placeholder='Search QPL Stories'></input>
      </div>
    </div>
  </>
}

export default Header;
