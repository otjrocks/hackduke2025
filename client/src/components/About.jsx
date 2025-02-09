
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import AboutBox from './AboutBox';
import '../Home.css'


export default function About() {
    return (
        <>
        <div className='home-page'>
            <Header />
            <AboutBox />
            <Footer />
        </div>
        </>
    )
}