import React, { useState, useEffect } from 'react';
import OrderService from '../services/orderService';
import CustomerService from '../services/customerService';
import './AddOrder.css'; // Import the CSS file for styling
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const AddOrder = ({ setOrders, toggleAddForm }) => {
    const [order, setOrder] = useState({
        customerId: '',
        orderDateTime: '',
        orderSize: '',
        saleValue: '',
    });
    const [message, setMessage] = useState(''); // State for success or error message
    const navigate = useNavigate(); // Initialize navigate

    const [customers, setCustomers] = useState([]);

    // Fetch all customers
    useEffect(() => {
        CustomerService.getAllCustomers()
            .then((response) => {
                setCustomers(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the customers!", error);
            });
    }, []);

    // Handle input change for order
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        
        if (name === 'orderSize' || name === 'saleValue') {
            const numValue = parseFloat(value);
            if (numValue <= 1 || numValue < 0) {
                setMessage(`${name === 'orderSize' ? 'Order size' : 'Sale value'} must be greater than 1`);
            } else {
                setMessage('');
            }
        }
        
        setOrder({ ...order, [name]: value });
    };

    const handleCustomerChange = (event) => {
        setOrder({ ...order, customerId: event.target.value });
    };

    // Helper: Prepare order data to match Flask expected keys
    const prepareOrderData = (customerId) => {
        const orderTime = order.orderDateTime.replace("T", " ") + ":00";  // Ensure it's in proper format
        return {
            customer_id: customerId,
            order_time: orderTime,
            order_size: order.orderSize,
            sale_value: order.saleValue,
        };
    };

    // Handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();

        if (!order.customerId) {
            console.error("No customer selected");
            return;
        }

        // Validate order size and sale value
        if (parseFloat(order.orderSize) <= 1 || parseFloat(order.orderSize) < 0) {
            setMessage('Order size must be greater than 1');
            return;
        }
        if (parseFloat(order.saleValue) <= 1 || parseFloat(order.saleValue) < 0) {
            setMessage('Sale value must be greater than 1');
            return;
        }

        const orderData = prepareOrderData(order.customerId);
        OrderService.addOrder(orderData)
            .then((response) => {
                setOrders((prevOrders) => [...prevOrders, response.data]); // Add the new order to the list
                toggleAddForm(); // Close the form after successful addition
                navigate('/records')
            })
            .catch((error) => {
                navigate('/records')
            });
    };

    return (
        <div className="add-order-form">
            <h3>Add New Order</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="customerId">Select Customer:</label>
                    <select
                        id="customerId"
                        name="customerId"
                        value={order.customerId}
                        onChange={handleCustomerChange}
                    >
                        <option value="">Select an existing customer</option>
                        {customers.map((customer) => (
                            <option key={customer.id} value={customer.id}>
                                {customer.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="orderDateTime">Order Date &amp; Time:</label>
                    <input
                        type="datetime-local"
                        id="orderDateTime"
                        name="orderDateTime"
                        value={order.orderDateTime}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="orderSize">Order Size (Reams of Paper):</label>
                    <input
                        type="number"
                        id="orderSize"
                        name="orderSize"
                        value={order.orderSize}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="saleValue">Sale Value ($):</label>
                    <input
                        type="number"
                        id="saleValue"
                        name="saleValue"
                        value={order.saleValue}
                        onChange={handleInputChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn-add-order">Add Order</button>
            </form>
            {message && <p className="error-message">{message}</p>}
        </div>
    );
};

export default AddOrder;
