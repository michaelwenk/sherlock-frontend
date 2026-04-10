import React from 'react';
import ReactDOM from 'react-dom/client';
import Sherlock from './component/Sherlock';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <Sherlock />
  </React.StrictMode>,
);
