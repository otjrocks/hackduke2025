import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from "./Home"
import Product from './components/Product';
import Browse from './components/Browse';
import AddProduct from "./components/AddProduct"
import Profile from "./components/Profile"
import ProductsList from './components/ProductsList';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css';
import About from './components/About';
import Login from './components/Login';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/about", element: <About /> },
  { path: "/product", element: <Product /> },
  { path: "/browse", element: <Browse /> },
  {
    path: "/profile",
    element: <Profile />
  },
  {
    path: "/addproduct",
    element: <AddProduct />
  },
  // Updated route with dynamic theme parameter
  {
    path: "/products/:theme", // :theme is the dynamic parameter
    element: <ProductsList />
  }, 
  {
    path: "/login",
    element: <Login />
  }, 
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/forgot",
    element: <ForgotPassword />
  },
  {
    path: "/reset/:token",
    element: <ResetPassword />
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode> 
    <RouterProvider router={router} />
  </React.StrictMode>,
)
