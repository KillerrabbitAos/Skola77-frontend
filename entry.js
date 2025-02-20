ola77/entry.js
const React = require('react');
const ReactDOM = require('react-dom/client');
const { App } = require('./src/index.js');

function initializeApp(containerId) {
  const root = ReactDOM.createRoot(document.getElementById(containerId));
  root.render(React.createElement(App));
}

module.exports = { initializeApp };