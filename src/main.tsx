import { createRoot } from 'react-dom/client'

import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

console.log('Main.tsx: Starting application...');

const rootElement = document.getElementById("root");
console.log('Main.tsx: Root element found:', !!rootElement);

if (!rootElement) {
  console.error('Main.tsx: Root element not found!');
} else {
  console.log('Main.tsx: Creating React root...');
  createRoot(rootElement).render(
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
  console.log('Main.tsx: React app rendered');
}
