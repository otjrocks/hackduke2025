import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import ProductsList from "./ProductsList";

const ProductsListPage = () => {
    const { theme } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);  // State to track the current page
    const [hasMore, setHasMore] = useState(true);      // To track if there's more data to load

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/product/get/${theme}?page=${currentPage}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.success) {
                        // If it's the first page, just set the products
                        if (currentPage === 1) {
                            setProducts(data.products);
                        } else {
                            // For subsequent pages, append products, avoiding duplicates
                            setProducts((prev) => {
                                const newProducts = data.products.filter(product =>
                                    !prev.some(existingProduct => existingProduct._id === product._id)
                                );
                                return [...prev, ...newProducts];
                            });
                        }

                        // Check if there are more pages to load
                        setHasMore(currentPage < data.totalPages);
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
    }, [currentPage, theme]);  // Trigger fetching when the page or theme changes

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            setCurrentPage((prev) => prev + 1);  // Increment page to fetch more products
        }
    };

    if (loading && currentPage === 1) return <><Header /><div className="main-content"><h1>Loading...</h1></div></>;
    if (error) return <><Header /><div className="main-content"><h1>{error}</h1></div></>;

    return (
        <>
            <Header />
            <div className="main-content">
                <h1>Products for {theme}</h1>
                <ProductsList products={products} theme={theme} />
                {loading && currentPage > 1 && (
                    <div className="loading-spinner">Loading...</div>
                )}

                {!hasMore && products.length > 0 && (
                    <p className="end-of-list">No more products to load.</p>
                )}

                {hasMore && !loading && (
                    <button className="load-more-button" onClick={handleLoadMore}>
                        Load More
                    </button>
                )}
            </div>
        </>
    );
};

export default ProductsListPage;
