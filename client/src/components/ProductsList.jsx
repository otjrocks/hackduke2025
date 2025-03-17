import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Header from "./Header";

const ProductsList = () => {
    const { theme } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products by theme using fetch API
                const response = await fetch(process.env.REACT_APP_SERVER_URL + `/product/get/${theme}`, {
                    method: 'GET',
                    credentials: 'include', // Make sure credentials (cookies) are sent with the request
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                // Check if the response is successful
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
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [theme]);

    if (loading) {
        return <>
        <Header />

        <div className="main-content">
            <h1>
            Loading ...
            </h1>
            </div>
        
        </>
    }

    if (error) {
        return <>
        <Header />

        <div className="main-content">
            <h1>
            {error}
            </h1>
            <Link to={process.env.REACT_APP_CLIENT_URL + "/login"} className="browse-link">login</Link>
            </div>
        
        </>;
    }

    return (
        <>
        
        <Header />
        <div className="main-content">
            {products.length < 1 ? (
                <>
                    <h2>Sorry, there are no products for the theme {theme}!</h2>
                </>
            ) : (
                <>
                    <h1>Products for {theme}</h1>
                    <div className="product-list">
                        {products.map((product) => (
                            <div key={product._id} className="product-item">
                                <h2>{product.name}</h2>
                                <p>Size: {product.size}</p>
                                <p>Price: ${product.price}</p>
                                <p>Sold: {product.isSold ? "Yes" : "No"}</p>
                                <p>Email: {product.email}</p>
                                {product.image && (
                                    <img src={product.image} alt={product.name} />
                                )}
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
        </>
    );
};

export default ProductsList;
