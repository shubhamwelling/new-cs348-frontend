import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CustomerService from '../services/customerService';
import './UpdateCustomer.css'; // Import the CSS for styling

const UpdateCustomer = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        phone: '',
        age: '',
    });

    useEffect(() => {
        CustomerService.getCustomer(id)
            .then((response) => {
                setCustomer(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the customer data!", error);
            });
    }, [id]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setCustomer({
            ...customer,
            [name]: value,
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        CustomerService.updateCustomer(id, customer)
            .then(() => {
                navigate('/records'); // Redirect to the customer list after update
            })
            .catch((error) => {
                navigate('/records');
                //console.error("There was an error updating the customer!", error);
            });
    };

    return (
        <div className="update-customer-container">
            <h2>Update Customer Information</h2>
            <form onSubmit={handleSubmit} className="update-customer-form">
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
                <button type="submit" className="submit-btn">Update Customer</button>
            </form>
        </div>
    );
};

export default UpdateCustomer;