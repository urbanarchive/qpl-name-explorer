import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import TypeaheadSearch from '../features/TypeaheadSearch';
import qplLogo from '../features/images/noimage.png';
import Modal from './Modal';

function Header({ locations }) {
  const [showModal, toggleModal] = useState(false);

  return <>
    <div className="flex gap-4 p-4 shadow-lg z-10">
      <Link to="/" className="flex w-14 h-8 items-center">
        <img className='w-8 h-8 bg-red-100 rounded-md' src={qplLogo} alt="QPL Logo" />
      </Link>
      <div className="flex h-8 w-80 items-center">
        <TypeaheadSearch
          locations={locations}
        />
      </div>
      <div className="flex ml-auto gap-2 h-8 items-center">
        <div className="flex ml-auto h-8 items-center bg-blue-500 text-white p-4 rounded-full cursor-pointer">
          <Link to="/faq">
            FAQ
          </Link>
        </div>
        <div onClick={() => toggleModal(true)} className="flex ml-auto h-8 items-center bg-blue-500 text-white p-4 rounded-full cursor-pointer">
          Add/Edit
        </div>
      </div>
    </div>

    {showModal && <Modal toggle={toggleModal}>
      <iframe
        title='contribute'
        className="airtable-embed"
        src="https://airtable.com/embed/shrgh1JeFy8Yim4hv?backgroundColor=blue"
        frameBorder="0"
        width="100%"
        height="533"></iframe>
      </Modal>}
  </>
}

export default Header;
