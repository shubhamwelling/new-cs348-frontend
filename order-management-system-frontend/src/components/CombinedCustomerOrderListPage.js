import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CustomerService from '../services/customerService';
import OrderService from '../services/orderService';
import './EntityList.css'; // Renamed CSS file for universal styling
import AddOrder from './AddOrder';

const CombinedList = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [message, setMessage] = useState(null);
    const navigate = useNavigate();

    // Fetch customers
    useEffect(() => {
        CustomerService.getAllCustomers()
            .then((response) => {
                setCustomers(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the customers!", error);
            });
    }, []);

    // Fetch orders
    useEffect(() => {
        OrderService.getAllOrders()
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the orders!", error);
            });
    }, []);

    // Handle customer delete
    const handleDeleteCustomer = async (customerId) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await CustomerService.deleteCustomer(customerId);
                // Update customers list
                setCustomers(prevCustomers => prevCustomers.filter(c => c.customer_id !== customerId));
                // Update orders list
                setOrders(prevOrders => prevOrders.filter(o => o.customer_id !== customerId));
                setMessage({ type: 'success', text: 'Customer deleted successfully' });
            } catch (error) {
                console.error('Error deleting customer:', error);
                setMessage({ 
                    type: 'error', 
                    text: error.response?.data?.error || 'Failed to delete customer' 
                });
            }
            setTimeout(() => setMessage(null), 3000);
        }
    };

    // Handle order delete
    const handleOrderDelete = (orderId) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            OrderService.deleteOrder(orderId)
                .then(() => {
                    setOrders(orders.filter(order => order.order_id !== orderId));
                    setConfirmationMessage('Order deleted successfully');
                    setTimeout(() => setConfirmationMessage(''), 3000);
                })
                .catch((error) => {
                    console.error("There was an error deleting the order!", error);
                    setConfirmationMessage('Error deleting order');
                    setTimeout(() => setConfirmationMessage(''), 3000);
                });
        }
    };

    // Toggle add form visibility
    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };

    return (
        <div className="combined-list">
            {message && (
                <div className={`confirmation-message ${message.type === 'success' ? 'success' : 'error'}`}>
                    {message.text}
                </div>
            )}
            {/* Customer (or Entity) List Section */}
            <div className="entity-list">
                <h2 className="entity-section-header">Customer List</h2>
                <div className="add-entity-container">
                    <button className="add-entity-btn">
                        <Link to="/customers/add">Add New Customer</Link>
                    </button>
                </div>
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Age</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map((customer) => (
                            <tr key={customer.id}>
                                <td>{customer.name}</td>
                                <td>{customer.company}</td>
                                <td>{customer.email}</td>
                                <td>{customer.phone}</td>
                                <td>{customer.age}</td>
                                <td className="action-buttons">
                                    <button className="update-button">
                                        <Link to={`/customers/update/${customer.id}`}>Update</Link>
                                    </button>
                                    <button className="delete-button" onClick={() => handleDeleteCustomer(customer.id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Order (or Entity) List Section */}
            <div className="entity-list">
                <h2 className="entity-section-header">Order List</h2>
                <div className="add-entity-container">
                    <button className="add-entity-btn">
                        <Link to="/orders/add">Add New Order</Link>
                    </button>
                </div>
                {showAddForm && <AddOrder setOrders={setOrders} toggleAddForm={toggleAddForm} />}
                <table className="entity-table">
                    <thead>
                        <tr>
                            <th>Customer</th>
                            <th>Company</th>
                            <th>Order Date</th>
                            <th>Order Size (Reams)</th>
                            <th>Sale Value ($)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => {
                            // Convert order_time to 12-hour AM/PM format
                            const formattedTime = new Date(order.order_time).toLocaleString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: 'numeric',
                                minute: 'numeric',
                                hour12: true, // Enables AM/PM format
                            });

                            return (
                                <tr key={order.order_id}>
                                    <td>{order.customer_name}</td>
                                    <td>{order.customer_company}</td>
                                    <td>{formattedTime}</td>
                                    <td>{order.order_size}</td>
                                    <td>${order.sale_value.toFixed(2)}</td>
                                    <td className="action-buttons">
                                        <button className="update-button">
                                            <Link to={`/orders/update/${order.order_id}`}>Update</Link>
                                        </button>
                                        <button className="delete-button" onClick={() => handleOrderDelete(order.order_id)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
            <div className="center-container">
                <h2 className="entity-section-header">Access Sales Reports 📊 </h2>
                <div className="add-entity-container">
                    <button className="add-entity-btn">
                        <Link to="/reports">Report Generation</Link>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CombinedList;
