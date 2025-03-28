import React, { useState, useEffect } from 'react';
import './Header.css'; // You can add styling here or inline
import { Link } from 'react-router-dom';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false); // state to toggle menu visibility

    useEffect(() => {
        const checkAuthentication = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(process.env.REACT_APP_SERVER_URL + '/user/userinfo', {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                if (data.success && data.authenticated) {
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching user info:", error);
                setIsLoggedIn(false);
                setIsLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    return (
        <header className="header">
            <Link className="app-name" to="/">Campus Closet</Link>
            {/* Hamburger icon */}
            <div className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                &#9776;
            </div>
            <nav className={`navigation ${isMenuOpen ? 'open' : ''}`}>
                    {isLoading && (
                            <div className="spinner-container">
                                <div className="spinner"></div>
                            </div>
                    )}
                    { !isLoading &&
                    <ul>
                    <li><Link to="/">home</Link></li>
                    <li><Link to="/about">about</Link></li>
                    <li><Link to="/browse">browse</Link></li>
                    { isLoggedIn ? (
                        <>
                            <li><Link to="/profile">profile</Link></li>
                            <li><Link to="/addproduct">add product</Link></li>
                            <li><Link to={process.env.REACT_APP_SERVER_URL + '/user/logout'}>logout</Link></li>
                        </>
                    ) : (
                        <li><Link to={process.env.REACT_APP_CLIENT_URL + '/login'}>login</Link></li>
                    )}
                    </ul>
                    }

            </nav>
        </header>
    );
}
