import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { msalReady } from './auth/msalInstance';
import { App } from './app/App';

msalReady.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
