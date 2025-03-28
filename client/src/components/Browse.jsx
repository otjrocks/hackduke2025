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
                const response = await fetch(`${process.env.REACT_APP_SERVER_URL}/product/get/?page=${currentPage}`, {
                    method: 'GET',
                    credentials: 'include', // Make sure credentials (cookies) are sent with the request
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) throw new Error("Failed to fetch products");
                const data = await response.json();
                console.log(data)
                if (!data.success) {
                    setError(data.message);
                } else {
                    setError("");
                    if (data.products === undefined) {
                        setError("No products available")
                        setHasMore(false);
                    }
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
            {loading && (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
            )}
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
                <h1>Browse Duke's Closet</h1>
                <h2>Browse By Theme:</h2>
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

                <h2>Browse All:</h2>
                <ProductsList products={products} />
                <div className="after-products">
                {loading && (
                    <div className="spinner-container">
                        <div className="spinner"></div>
                    </div>
                )}

                {hasMore && !loading && (
                    <button className="load-more-button" onClick={handleLoadMore}>
                        Load More
                    </button>
                )}
                </div>
            </div>
                )
            }
        </>
    );
}
