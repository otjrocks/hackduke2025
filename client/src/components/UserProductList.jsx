import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function UserProductList({ email }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!email) return;

    const fetchUserProducts = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/products/get-by-email/${email}`, {
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

    fetchUserProducts();
  }, [email]);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <ul className="product-list">
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        products.map((product) => (
          <li key={product._id} className="product-item">
            <img src={product.image} alt={product.name} className="product-image" />
            <div>
              <h3>{product.name}</h3>
              <p>Size: {product.size}</p>
              <p>Price: ${product.price}</p>
              <p>Status: {product.isSold ? 'Sold' : 'Available'}</p>
            </div>
          </li>
        ))
      )}
    </ul>
  );
}
