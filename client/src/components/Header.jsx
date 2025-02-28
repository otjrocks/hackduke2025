import React from 'react';
import './Header.css'; // You can add styling here or inline
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    
        useEffect(() => {
            const checkAuthentication = async () => {
                try {
                    const response = await fetch(process.env.REACT_APP_SERVER_URL + '/user/userinfo', {
                        method: 'GET',
                        credentials: 'include', // Make sure credentials (cookies) are sent with the request
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                    console.log(process.env.REACT_APP_SERVER_URL + '/user/userinfo');
                    const data = await response.json();
                    console.log(data);
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
            <header className="header">
                <Link className="app-name" to="/"><div className="app-name">Campus Closet</div></Link>
                <nav className="navigation">
                    <ul>
                        <li><Link to="/">home</Link></li>
                        <li><Link to="/about">about</Link></li>
                        <li><Link to="/browse">browse</Link></li>
                        
                        {isLoggedIn ? (
                            <>
                                <li><Link to="/profile">profile</Link></li>
                                <li><Link to={process.env.REACT_APP_SERVER_URL + '/user/logout'}>logout</Link></li>
                            </>
                        ) : (
                            <li><Link to={process.env.REACT_APP_CLIENT_URL + '/login'}>login</Link></li>
                        )}
                    </ul>
                </nav>
            </header>
        );
}
