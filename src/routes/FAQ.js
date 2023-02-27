import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import FaqPage from '../pages/faq.md';

function FAQPage() {
  const [text, setText] = useState('');

  useEffect(() => {
    fetch(FaqPage)
      .then((response) => response.text())
      .then((md) => {
        setText(md);
      });
  }, []);

  return <div className='p-4'>
    <h1 className='text-3xl pb-4 font-feather uppercase'>
      Queens Name Explorer
    </h1>

    <ReactMarkdown className='prose'>
      {text}
    </ReactMarkdown>
  </div>
}

export default FAQPage;
