import React from 'react';
import './Footer.css'; // You can add styling here or inline
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="app-name">Campus Closet</div>
            <nav className="navigation">
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">about</Link></li>
                    <li><Link to="/profile">Profile</Link></li>
                </ul>
            </nav>
        </footer>
    );
}
