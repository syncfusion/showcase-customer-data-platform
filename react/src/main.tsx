import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerLicense } from '@syncfusion/ej2-base';
import App from './App';
import './theme/tokens.css';
import '@syncfusion/ej2/tailwind3.css';
import './theme/syncfusion-overrides.css';
import './theme/app.css';

const licenseKey = import.meta.env.VITE_SYNCFUSION_LICENSE_KEY;
if (licenseKey) registerLicense(licenseKey);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);