import React from 'react'
import { Link } from 'react-router-dom';
import TypeaheadSearch from '../features/TypeaheadSearch';
import qplLogo from '../features/images/qpl_logo.png';

function Header({ monuments }) {
  return <>
    <div className="flex gap-4 p-4 shadow-lg z-10">
      <Link to="/" className="flex w-10 h-8 items-center">
        <img className='w-8 h-8 bg-red-100 rounded-md' src={qplLogo} alt="QPL Logo" />
      </Link>
      <div className="flex h-8 w-80 items-center">
        <TypeaheadSearch
          monuments={monuments}
        />
      </div>
    </div>
  </>
}

export default Header;
