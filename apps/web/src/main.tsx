import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { fetchGreeting } from './api/greeting.ts';
import { App } from './App.tsx';
import './index.css';

const root = document.querySelector('#root');

if (root === null) {
  throw new Error('index.html has no #root element');
}

createRoot(root).render(
  <StrictMode>
    <App getGreeting={async name => fetchGreeting(name)} />
  </StrictMode>,
);
