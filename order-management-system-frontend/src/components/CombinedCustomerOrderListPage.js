import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CustomerService from '../services/customerService';
import OrderService from '../services/orderService';
import './EntityList.css'; // Renamed CSS file for universal styling
import AddOrder from './AddOrder';

const CombinedList = () => {
    const [customers, setCustomers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

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

    // Handle customer delete and force reload
    const handleCustomerDelete = (customerId) => {
        CustomerService.deleteCustomer(customerId)
            .then(() => {
                setCustomers(customers.filter(customer => customer.id !== customerId));
                window.location.reload();
            })
            .catch((error) => {
                console.error("There was an error deleting the customer!", error);
                window.location.reload();
            });
    };

    // Handle order delete
    const handleOrderDelete = (orderId) => {
        OrderService.deleteOrder(orderId)
            .then(() => {
                setOrders(orders.filter(order => order.order_id !== orderId));
            })
            .catch((error) => {
                console.error("There was an error deleting the order!", error);
            });
    };

    // Toggle add form visibility
    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };

    return (
        <div className="combined-list">
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
                                    <button className="delete-button" onClick={() => handleCustomerDelete(customer.id)}>
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
                {confirmationMessage && <p>{confirmationMessage}</p>}
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
                                    <td>{formattedTime}</td> {/* Updated Time Format */}
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
