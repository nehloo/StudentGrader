// Import React and ReactDOM
import React from 'react';
import ReactDOM from 'react-dom/client';

// Import Framework7
import Framework7 from 'framework7/lite-bundle';

// Import Framework7-React Plugin
import Framework7React from 'framework7-react';

// Import main Framework7 styles
import 'framework7/css/bundle';

// Import Icons and App Custom Styles
import '../css/icons.css';
import '../css/app.css';

// Import App Component
import App from '../components/app.jsx';

// Init F7 Vue Plugin
Framework7.use(Framework7React);

// Mount React App
const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);

console.log("🚀 App is loaded");