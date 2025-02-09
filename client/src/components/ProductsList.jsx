import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ProductsList = () => {
    const { theme } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // Fetch products by theme using fetch API
                const response = await fetch(`http://localhost:3001/product/get/${theme}`);

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
        <div>
            { products.length < 1 ?
            <>
            Sorry, There are no products for the theme {theme}!
            </> 
            :
            <>
            <h1>Products for {theme}</h1>
            <div className="product-list">
                {products.map((product) => (
                    <div key={product._id} className="product-item">
                        <h2>{product.name}</h2>
                        <p>Size: {product.size}</p>
                        <p>Price: ${product.price}</p>
                        <p>Sold: {product.isSold ? "Yes" : "No"}</p>
                        {product.image && <img src={product.image} alt={product.name} />}
                    </div>
                ))}
            </div>
            </>
            }
        </div>
    );
};

export default ProductsList;

