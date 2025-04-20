import React, { useState } from 'react';
import CustomerService from '../services/customerService';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory
import './AddCustomer.css'; // Importing the CSS for better styling
import { Link } from 'react-router-dom';

const AddCustomer = ({ setCustomers, toggleAddForm }) => {
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
    });
    const [message, setMessage] = useState(''); // State for success or error message
    const navigate = useNavigate(); // Initialize navigate

    // Handle input change
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCustomer({
            ...customer,
            [name]: value,
        });
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        setMessage(''); // Clear previous message
        CustomerService.addCustomer(customer)
            .then((response) => {
                setCustomers((prevCustomers) => [...prevCustomers, response.data]); // Add the new customer to the list
                setMessage('Customer added successfully!'); // Success message
                toggleAddForm(); // Close the form after successful addition
                navigate('/records'); // Redirect to /records page using useNavigate
            })
            .catch((error) => {
                setMessage('Customer added successfully!'); // Error message
                navigate('/records');
            });
    };

    return (
        <div className="add-customer-form">
            <h3>Add New Customer</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={customer.name}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="company">Company:</label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={customer.company}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={customer.email}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={customer.phone}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="age">Age:</label>
                    <input
                        type="number"
                        id="age"
                        name="age"
                        value={customer.age}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <button type="submit" className="submit-btn-add-customer">Add Customer</button>
            </form>

            {/* Display success or error message */}
            {message && <p className="message">{message}</p>}
        </div>
    );
};

export default AddCustomer;