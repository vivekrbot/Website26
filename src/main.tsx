import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { router } from './router';
import './styles/global.css';

// Prevent flash of wrong theme — reads localStorage before React hydrates
const storedTheme = localStorage.getItem('vr-theme');
const prefersDark = !window.matchMedia('(prefers-color-scheme: light)').matches;
const theme =
  storedTheme === 'light' || storedTheme === 'dark'
    ? storedTheme
    : prefersDark
    ? 'dark'
    : 'light';
document.documentElement.setAttribute('data-theme', theme);

const root = document.getElementById('root');
if (!root) throw new Error('Root element not found');

createRoot(root!).render(
  <StrictMode>
    <HelmetProvider>
      <RouterProvider router={router} />
    </HelmetProvider>
  </StrictMode>
);
