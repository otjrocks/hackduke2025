import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from "./Home"
import Product from './components/Product';
import Browse from './components/Browse';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';



const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/product", element: <Product /> },
  { path: "/browse", element: <Browse /> },
  // { path: "/theme/:theme", element: <ThemePage /> }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>,
)