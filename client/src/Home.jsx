import './Home.css';
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="home-page">
            {/* Hero Section */}
            <div className="home-container">
                <h1>Welcome to Campus Closet</h1>
                <Link to="/browse" className="browse-link">browse themes</Link>
            </div>

            {/* About Us Section */}
            <div className="about-section">
                <h2>About Us</h2>
                <h3 classname="about title"> We are college students- Just like you.</h3>
                <p className="about-subtitle"> We understand the struggle of constantly finding the perfect outfit for themed parties. 
                That’s why we created Campus Closet—a platform built by students, for students.
                </p>

                <h3 className="about-heading">Our Mission</h3>
                <p>
                    We believe in making themed party dressing affordable and sustainable. 
                    Our goal is to help students buy, sell, and rent outfits for every ocassion.
                </p>
                <p className="about-ending">
                Together, we can dress the part—sustainably.
                </p>
              
            </div>
        </div>
    );
}