import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Home.css';
import Header from "./components/Header";
import AboutBox from "./components/AboutBox";

export default function Home() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const checkAuthentication = async () => {
            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + '/user/userinfo', {
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
            <Header />
            {/* Hero Section */}
            <div className="home-container">
                <h1>Welcome to Campus Closet</h1>
                {isLoggedIn ? (
                    <Link to="/browse" className="browse-link">browse items</Link>
                ) : (
                    <Link to={process.env.REACT_APP_CLIENT_URL + "/login"} className="browse-link">login to begin</Link>
                )}
            </div>

            <AboutBox />
        </div>
    );
}
