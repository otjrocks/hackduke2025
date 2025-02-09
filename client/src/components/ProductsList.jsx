import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const ProductsList = () => {
    const { theme } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(`http://localhost:3001/product/get/${theme}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        setProducts(data.products);
                    } else {
                        setError(data.message);
                    }
                } else {
                    setError("Failed to fetch products. Please try again.");
                }
            } catch (err) {
                setError("An error occurred while fetching the products.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [theme]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="products-container">
            {products.length < 1 ? (
                <p>Sorry, there are no products for the theme {theme}!</p>
            ) : (
                <>
                    <h1>Products for {theme}</h1>
                    <div className="product-list">
                        {products.map((product) => (
                            <Link to={`/product/${product._id}`} key={product._id} className="product-card">
                                <div className="product-item">
                                    <h2>{product.name}</h2>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ProductsList;


