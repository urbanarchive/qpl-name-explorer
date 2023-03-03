import React, { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown';
import FaqPage from '../pages/faq.md';
import ICONS from '../features/images/icons';

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

    <ReactMarkdown
      components={{
        img({node, ...props}) {
          try {
            const { src, alt } = props;
            if (alt.includes('icon')) {
              return <img alt={src} className='inline w-auto h-6 m-0' src={ICONS[src]} />
            }
  
            // props include alt text by default!
            // eslint-disable-next-line jsx-a11y/alt-text
            return <img {...props}/>;
          } catch (e) {
            // props include alt text by default!
            // eslint-disable-next-line jsx-a11y/alt-text
            return <img {...props}/>;
          }
        }
      }}
      className='prose'
    >
      {text}
    </ReactMarkdown>
  </div>
}

export default FAQPage;
