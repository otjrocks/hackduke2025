import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Home.css';

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch('http://localhost:3001/user/userinfo', {
                    method: 'GET',
                    credentials: 'include', // Make sure credentials (cookies) are sent with the request
                });

                const data = await response.json();

                if (data.success && data.authenticated) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error("Error fetching user info:", error);
                setIsLoggedIn(false);
            }
        };

        checkAuthentication();
    }, []); // Empty dependency array ensures this effect runs once on component mount

    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="home-container">
                <h1>Welcome to Campus Closet</h1>
                {isLoggedIn ? (
                    <Link to="/browse" className="browse-link">browse items</Link>
                ) : (
                    <Link to="http://localhost:3001/user/login" className="browse-link">login to begin</Link>
                )}
            </div>

            {/* About Us Section */}
            <div className="about-section">
                <h2>About Us</h2>
                <h3 className="about title">We are college students- Just like you.</h3>
                <p className="about-subtitle">
                    We understand the struggle of constantly finding the perfect outfit for themed parties. 
                    That’s why we created Campus Closet—a platform built by students, for students.
                </p>

                <h3 className="about-heading">Our Mission</h3>
                <p>
                    We believe in making themed party dressing affordable and sustainable. 
                    Our goal is to help students buy, sell, and rent outfits for every occasion.
                </p>
                <p className="about-ending">
                    Together, we can dress the part—sustainably.
                </p>
            </div>
        </div>
    );
}
