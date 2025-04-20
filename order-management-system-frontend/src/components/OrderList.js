import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';  // Make sure you have Link imported from react-router-dom
import OrderService from '../services/orderService';
import AddOrder from './AddOrder';

const OrderList = () => {
    const [orders, setOrders] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    useEffect(() => {
        OrderService.getAllOrders()
            .then((response) => {
                setOrders(response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the orders!", error);
            });
    }, []);

    const handleDelete = (orderId) => {
        OrderService.deleteOrder(orderId)
            .then(() => {
                setOrders(orders.filter(order => order.order_id !== orderId));
            })
            .catch((error) => {
                console.error("There was an error deleting the order!", error);
            });
    };

    const toggleAddForm = () => {
        setShowAddForm(!showAddForm);
    };

    return (
        <div className="order-list">
            <h2>Order List</h2>
            {/* Use Link to navigate to the new order page */}
            <Link to="/orders/add">
                <button>Add New Order</button>
            </Link>

            {showAddForm && <AddOrder setOrders={setOrders} toggleAddForm={toggleAddForm} />}

            {confirmationMessage && <p>{confirmationMessage}</p>}

            <table>
                <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Order Date</th>
                        <th>Order Size</th>
                        <th>Sale Value</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map((order) => (
                        <tr key={order.order_id}>
                            <td>{order.order_id}</td>
                            <td>{order.customer_name}</td>
                            <td>{order.order_time}</td>
                            <td>{order.order_size}</td>
                            <td>${order.sale_value.toFixed(2)}</td>
                            <td>
                                <button>
                                    <Link to={`/orders/update/${order.order_id}`}>Update</Link>
                                </button>
                                <button onClick={() => handleDelete(order.order_id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;