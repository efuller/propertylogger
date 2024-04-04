import React from 'react';
import ReactDOM from 'react-dom/client';
import { compositionRoot, createCompositionRoot } from './shared/compositionRoot/compositionRoot.tsx';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';

const domain = process.env.AUTH0_DOMAIN;
const clientId = process.env.AUTH0_CLIENT_ID;
const audience = process.env.AUTH0_AUDIENCE;

if (!domain || !clientId || !audience) {
  throw new Error('Missing Auth0 configuration');
}

await createCompositionRoot();
const router = compositionRoot.getRouter();
const routeMap = router.getRouteMap();
const browserRouter = createBrowserRouter(routeMap);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <RouterProvider router={browserRouter} />
);
