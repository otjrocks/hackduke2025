
import React from 'react';


export default function AboutBox() {
    return (
        <>
            {/* About Us Section */}
            <div id="about" className="about-section">
            <h2>About Us</h2>

            <img 
                    src="/about-us.jpg" 
                    alt="Campus Closet Team"
                    style={{
                        width: "100%",
                        maxWidth: "600px",
                        display: "block",
                        margin: "10px auto",
                        borderRadius: "10px"
                    }}
                    className="about-image"
            />
            <h3 className="about title">We are Duke students- Just like you.</h3>
            <p className="about-subtitle">
                Every college campus has it's own traditions, parties, and unforgettable events. <br />We understand the struggle of constantly finding the perfect outfit for every theme. 
                <br />That’s why we created Campus Closet—a sustainable way to buy, sell, and rent outfits for every ocassion - from one student to another. A platform built by students, for students.
            </p>

            <h3 className="about-heading">Our Mission</h3>
            <p>
                We believe in making themed party dressing affordable, accessible, and sustainable. 
            </p>
            <p className="about-ending">
                Together, we can dress the part—sustainably.
            </p>
            </div>
        </>
    )
}