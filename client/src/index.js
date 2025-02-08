import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from "./Home"
import Product from './components/Product';
import AddProduct from "./components/AddProduct"

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product",
    element: <Product />
  },
  {
    path: "/addproduct",
    element: <AddProduct />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>,
)