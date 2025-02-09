import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import './Profile.css';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/user/userinfo', {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserInfo(response.data.user);
          fetchUserProducts(response.data.user.email);
        } else {
          setError(response.data.message || 'User not authenticated');
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user info');
      }
    };

    fetchUserData();
  }, []);

  const fetchUserProducts = async (email) => {
    try {
      const response = await axios.get(`http://localhost:3001/product/get/email/${email}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        setError(response.data.message || 'No products found.');
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    window.location.href = 'http://localhost:3001/user/logout';
  };
  
  // Function to handle the deletion of a product
  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(`http://localhost:3001/product/delete/${productId}`);
      if (response.data.success) {
        setMessage("Product deleted successfully!");
        // Remove the deleted product from the list
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      } else {
        setMessage("Failed to delete product.");  }
      } catch (error) {
        setMessage("Error deleting product.");
      }
    };

  return (
    <>
    {
      userInfo ?
      <>
      <Header />
      <div className="main-content">
        <div className="profile-header">
          <h1>Welcome, {userInfo.nickname}!</h1>
          <p className="greeting">You're logged in as {userInfo.email}</p>
        </div>

        <Link to="/addproduct">
          <button className="logout-btn">Add New Product</button>
        </Link>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>

        <h2>Your Products</h2>
        {loading ? (
          <p>Loading products...</p>
        ) : products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <ul className="product-list">
            {products.map((product) => (
              <li key={product._id} className="product-item">
                <img src={"http://localhost:3001" + product.image} alt={product.name} className="product-image" />
                <div>
                  <h3>{product.name}</h3>
                  <p>Size: {product.size}</p>
                  <p>Price: ${product.price}</p>
                  <p>Status: {product.isSold ? 'Sold' : 'Available'}</p>
                  <button onClick={() => handleDelete(product._id)} className="delete-button">
                  Delete
                </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </> :
    <>
    <Header />
    <div className='main-content'>
    <h2>You are not logged in and cannot view the profile</h2>
    <Link onClick={() => window.location.href = 'http://localhost:3001/user/login'}><button>login</button></Link>
    </div>
    </>
    }
    </>
  );
}
