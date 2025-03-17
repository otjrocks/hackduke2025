import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ProductsList from "./ProductsList";

const ProductsListPage = () => {
    const { theme } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + `/product/get/${theme}`);
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

    if (loading) return <><Header /><div className="main-content"><h1>Loading...</h1></div></>;
    if (error) return <><Header /><div className="main-content"><h1>{error}</h1></div></>;

    return (
        <>
            <Header />
            <div className="main-content">
            {theme ? <h1>Products for {theme}</h1> : <h1>All products</h1>}
            <ProductsList products={products} theme={theme} />
            </div>
        </>
    );
};

export default ProductsListPage;
