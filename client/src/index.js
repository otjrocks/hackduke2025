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
<<<<<<< HEAD
  }, 
  {
    path: "/profile",
    element: <Profile />
=======
  },
  {
    path: "/addproduct",
    element: <AddProduct />
>>>>>>> 81cd65e2afe939f412c0d77a69ee6e5976a00daa
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>,
)