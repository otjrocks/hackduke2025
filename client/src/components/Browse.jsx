import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Browse.css";
import Header from "./Header";
import ProductsList from "./ProductsList";

export default function Browse() {
    const [themes, setThemes] = useState([]);
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchThemes = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/theme/themes`);
                if (!response.ok) throw new Error("Failed to fetch themes");
                const data = await response.json();
                setThemes(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchThemes();
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/product/get/${currentPage}`, {
                    method: 'GET',
                    credentials: 'include', // Make sure credentials (cookies) are sent with the request
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                if (!data.success) {
                    setError(data.message);
                } else {
                    setError("");
                    if (data.products.length === 0) {
                        setHasMore(false); // No more products to load
                    } else {
                        // If it's the first page, just set the products
                        if (currentPage === 1) {
                            setProducts(data.products);
                        } else {
                            // For subsequent pages, append products, but filter out duplicates
                            setProducts((prev) => {
                                const newProducts = data.products.filter(product =>
                                    !prev.some(existingProduct => existingProduct._id === product._id)
                                );
                                return [...prev, ...newProducts];
                            });
                        }
                        setHasMore(currentPage < data.totalPages); // Check if we have more pages
                    }
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProducts();
    }, [currentPage]);
    

    const handleThemeClick = (themeName) => navigate(`/products/${themeName}`);

    const handleLoadMore = () => {
        if (hasMore && !loading) {
            // Only update currentPage if there's more to load
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <>
            <Header />
            {error ? (
                <div className="browse-container">
                    <h1 className="error">{error}</h1> 
                    <br></br>
                    <Link to={process.env.REACT_APP_CLIENT_URL + "/login"} className="browse-link">login to begin</Link>
                </div>
            )
                :
                (
                <div className="browse-container">
                <h1>Browse Themes</h1>
                    <div className="theme-list">
                        {themes.map((theme) => (
                            <div
                                onClick={() => handleThemeClick(theme.name)}
                                key={theme._id}
                                className="theme-card"
                            >
                                <h3>{theme.name}</h3>
                            </div>
                        ))}
                    </div>

                <h1>All Listings</h1>
                <ProductsList products={products} />

                {loading && (
                    <div className="loading-spinner">
                        Loading...
                    </div>
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
                )
            }
        </>
    );
}
