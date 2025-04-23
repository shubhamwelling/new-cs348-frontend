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
    const [message, setMessage] = useState('');  // Add message state

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
        if (name === 'phone') {
            // Remove all non-digit characters
            const numbers = value.replace(/\D/g, '');
            
            // Format as XXX-XXX-XXXX as user types
            let formatted = '';
            if (numbers.length > 0) {
                formatted = numbers.substring(0, 3);
                if (numbers.length > 3) {
                    formatted += '-' + numbers.substring(3, 6);
                    if (numbers.length > 6) {
                        formatted += '-' + numbers.substring(6, 10);
                    }
                }
            }
            setCustomer({
                ...customer,
                [name]: formatted,
            });
        } else if (name === 'age') {
            // Only allow numbers and ensure it's between 1 and 100
            const ageValue = value.replace(/\D/g, ''); // Remove non-digit characters
            if (ageValue === '' || (parseInt(ageValue) >= 1 && parseInt(ageValue) <= 100)) {
                setCustomer({
                    ...customer,
                    [name]: ageValue,
                });
            }
        } else {
            setCustomer({
                ...customer,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate phone number format
        const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
        if (!phoneRegex.test(customer.phone)) {
            setMessage('Phone number must be in XXX-XXX-XXXX format');
            return;
        }

        // Validate age
        const age = parseInt(customer.age);
        if (isNaN(age) || age < 1 || age > 100) {
            setMessage('Age must be between 1 and 100 years old');
            return;
        }

        CustomerService.updateCustomer(id, customer)
            .then(() => {
                navigate('/records');
            })
            .catch((error) => {
                navigate('/records');
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
                    <label htmlFor="phone">Phone(XXX-XXX-XXXX):</label>
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
            {message && <p style={{ color: 'red', fontSize: '14px', fontFamily: 'Arial, sans-serif', marginTop: '10px' }}>{message}</p>}
        </div>
    );
};

export default UpdateCustomer;