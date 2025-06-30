import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { registerSW } from 'virtual:pwa-register';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Refresh to update?")) {
      window.location.reload();
    }
  },
  onOfflineReady() {
    console.log("App is ready to work offline");
  },
});
