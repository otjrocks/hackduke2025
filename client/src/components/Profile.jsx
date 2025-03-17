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
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [totalPages, setTotalPages] = useState(1); // Total pages

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL + '/user/userinfo', {
          withCredentials: true,
        });

        if (response.data.success) {
          setUserInfo(response.data.user);
          await fetchUserProducts(response.data.user.email, currentPage);
        } else {
          setError(response.data.message || 'User not authenticated');
          setLoading(false);
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Failed to fetch user info');
      }
    };

    const fetchUserProducts = async (email, page) => {
      try {
        const response = await axios.get(process.env.REACT_APP_SERVER_URL + `/product/get/email/${email}?page=${page}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setProducts(response.data.products);
          setTotalPages(response.data.totalPages);
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

    fetchUserData();
  }, [currentPage]); // Runs every time the page is loaded or the currentPage changes

  const handleLogout = () => {
    window.location.href = process.env.REACT_APP_SERVER_URL + '/user/logout';
  };

  // Function to handle the deletion of a product
  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(process.env.REACT_APP_SERVER_URL + `/product/delete/${productId}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setMessage(response.data.success);
        // Remove the deleted product from the list
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      } else {
        console.log(response.data);
        setMessage(response.data.message);  
      }
    } catch (error) {
      setMessage("Error deleting product.");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <>
      {loading ? <></> :
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

          {/* Pagination Controls */}
          <div className="pagination-controls">
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
        </div>
      </> :
      <>
        <Header />
        <div className='main-content'>
          <h2>You are not logged in and cannot view the profile</h2>
          <Link onClick={() => window.location.href = process.env.REACT_APP_CLIENT_URL + "/login"}>
            <button>Login</button>
          </Link>
        </div>
      </>
      }
    </>
  );
}
