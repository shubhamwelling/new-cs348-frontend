import React from 'react';
import './HomePage.css'; // Ensure this file is imported for styling
import dunderImage from '../assets/dundermifflinpaper.jpg';
import officePoster from '../assets/theofficeposter.jpg';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-page">
            <div className="image-container">
                <img src={dunderImage} alt="Dunder Mifflin Paper" />
                <img src={officePoster} alt="The Office Poster" />
            </div>
            <h3>
                Welcome to the Dunder Mifflin Order Management System! Inspired by The Office, this app
                streamlines the order management process for our favorite paper company
                by allowing the crew to quickly log customer and order information for paper orders made over the phone and in-person.
            </h3>
            <div className="link-container">
                <Link to="/records" className="arrow-button">
                    <span className="arrow">Navigate to System &#8594;</span> {/* Arrow inside the button */}
                </Link>
            </div>
        </div>
    );
};

export default HomePage;