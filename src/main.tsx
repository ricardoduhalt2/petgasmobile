import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import './styles/global.css';
import 'normalize.css';
import './i18n';

// Set the basename for the router
const basename = process.env.NODE_ENV === 'production' ? '/' : '/';

// Get the root container
const container = document.getElementById('root');

if (!container) {
  throw new Error('Failed to find the root element');
}

// Create a root
const root = createRoot(container);

// Render the app
root.render(
  <StrictMode>
    <Router basename={basename}>
      <App />
    </Router>
  </StrictMode>
);
