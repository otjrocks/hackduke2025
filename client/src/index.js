import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from "./Home"
import Product from './components/Product';
<<<<<<< HEAD
import Browse from './components/Browse';
=======
import AddProduct from "./components/AddProduct"
import Profile from "./components/Profile"
>>>>>>> 7883a407090bd9f0fe44da7b1db5d82d371e5818

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';



const router = createBrowserRouter([
<<<<<<< HEAD
  { path: "/", element: <Home /> },
  { path: "/product", element: <Product /> },
  { path: "/browse", element: <Browse /> },
  // { path: "/theme/:theme", element: <ThemePage /> }
=======
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/product",
    element: <Product />
  }, 
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/addproduct",
    element: <AddProduct />
  }
>>>>>>> 7883a407090bd9f0fe44da7b1db5d82d371e5818
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>,
)