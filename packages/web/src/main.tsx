import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { compositionRoot } from './compositionRoot.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

const domain = import.meta.env.VITE_AUTH0_DOMAIN;
const clientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
const audience = import.meta.env.VITE_AUTH0_AUDIENCE;

if (!domain || !clientId || !audience) {
  throw new Error('Missing Auth0 configuration');
}

const router = compositionRoot.getRouter();
const routeMap = router.getRouteMap();
const browserRouter = createBrowserRouter(routeMap);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={browserRouter} />
  </React.StrictMode>,
);
