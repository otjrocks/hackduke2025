import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Link } from 'react-router-dom';
import './Profile.css';
import './../index.css';

export default function Profile() {
  const [userInfo, setUserInfo] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchUserProducts = async (email, page) => {
    try {
      const response = await axios.get(process.env.REACT_APP_SERVER_URL + `/product/get/email/${email}?page=${page}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };
  
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/user/userinfo', {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserInfo(response.data.user);
          await fetchUserProducts(response.data.user.email, currentPage);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentPage]);

  const handleLogout = () => {
    window.location.href = process.env.REACT_APP_SERVER_URL + '/user/logout';
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(process.env.REACT_APP_SERVER_URL + `/product/delete/${productId}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setMessage(response.data.success);
        setProducts((prev) => prev.filter((p) => p._id !== productId));
      } else {
        setMessage(response.data.message);
      }
    } catch {
      setMessage("Error deleting product.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      <Header />

      <div className="main-content">
        {userInfo ? (
          <>
            <div className="profile-header">
              <h1>Welcome, {userInfo.nickname}!</h1>
              <p className="greeting">You're logged in as {userInfo.email}</p>
            </div>

            <div>
            <Link to="/addproduct">
                <button className="logout-btn">Add New Product</button>
              </Link>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </div>

            <h2>Your Products</h2>
        

        
            {products.length === 0 ? (
              <p className="no-products-message">You haven’t listed anything yet.</p>
            ) : (
              <ul className="product-list">
                {message && <p>{message}</p>}
                {products.map((product) => (
                  <li key={product._id} className="product-item">
                    <img src={product.image} alt={product.name} className="product-image" />
                    <div>
                      <h3>{product.name}</h3>
                      <p>Size: {product.size}</p>
                      <p>Price: ${product.price}</p>
                      <button onClick={() => handleDelete(product._id)} className="delete-button">
                        Remove listing
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="after-products pagination-controls">
              {currentPage > 1 && (
                <button onClick={() => handlePageChange(currentPage - 1)} className="pagination-button">
                  Previous
                </button>
              )}
              {currentPage < totalPages && (
                <button onClick={() => handlePageChange(currentPage + 1)} className="pagination-button">
                  Next
                </button>
              )}
            </div>
          </>
        ) : !loading ? (
          <>
            <h2>You are not logged in and cannot view the profile</h2>
            <Link to="/login">
              <button>Login</button>
            </Link>
          </>
        ) : null}
      </div>
    </>
  );
}