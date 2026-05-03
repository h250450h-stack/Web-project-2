import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// This is the "Magic Line" that makes the webpage beautiful
import 'bootstrap/dist/css/bootstrap.min.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
