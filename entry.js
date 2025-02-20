import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './src/index.js';

function initializeApp(containerId) {
  const root = ReactDOM.createRoot(document.getElementById(containerId));
  root.render(<App />);
}

export { initializeApp };