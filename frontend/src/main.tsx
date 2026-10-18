import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Polyfill requestIdleCallback and cancelIdleCallback for Safari / WebKit support
if (typeof window !== 'undefined') {
  if (!('requestIdleCallback' in window)) {
    (window as any).requestIdleCallback = function (cb: (deadline: { didTimeout: boolean; timeRemaining: () => number }) => void) {
      const start = Date.now();
      return window.setTimeout(() => {
        cb({
          didTimeout: false,
          timeRemaining: () => Math.max(0, 50 - (Date.now() - start)),
        });
      }, 1);
    };
  }

  if (!('cancelIdleCallback' in window)) {
    (window as any).cancelIdleCallback = function (id: number) {
      window.clearTimeout(id);
    };
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

