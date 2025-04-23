import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../services/orderService';
import './UpdateOrder.css'; // Import the new CSS for styling

const UpdateOrder = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState({
        customer_name: '',
        customer_company: '',
        order_time: '',
        order_size: '',
        sale_value: ''
    });
    const [confirmationMessage, setConfirmationMessage] = useState('');

    useEffect(() => {
        OrderService.getOrder(id)
            .then((response) => {
                setOrder(response.data[0]);
                console.log("ORDER IN UPDATEORDER.js is ", response.data);
            })
            .catch((error) => {
                console.error("There was an error fetching the order data!", error);
            });
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate order size and sale value
        if (parseFloat(order.order_size) <= 1 || parseFloat(order.order_size) < 0) {
            setConfirmationMessage('Order size must be greater than 1');
            return;
        }
        if (parseFloat(order.sale_value) <= 1 || parseFloat(order.sale_value) < 0) {
            setConfirmationMessage('Sale value must be greater than 1');
            return;
        }

        OrderService.updateOrder(id, order)
            .then(() => {
                //setConfirmationMessage('Order updated successfully!');
                navigate('/records')
            })
            .catch((error) => {
                //setConfirmationMessage('Order updated successfully!');
                navigate('/records')
            });
    };

    return (
        <div className="update-order-container">
            <h2>Update Order Information</h2>
            <form onSubmit={handleSubmit} className="update-order-form">
                <div className="form-group">
                    <label>Customer Name:</label>
                    <input type="text" value={order.customer_name} disabled />
                </div>
                <div className="form-group">
                    <label>Company:</label>
                    <input type="text" value={order.customer_company} disabled />
                </div>

                <div className="form-group">
                    <label>Order Time:</label>
                    <input type="text" value={order.order_time} disabled />
                </div>

                <div className="form-group">
                    <label>Order Size:</label>
                    <input
                        type="number"
                        value={order.order_size}
                        onChange={(e) => setOrder({ ...order, order_size: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Sale Value:</label>
                    <input
                        type="number"
                        step="0.01"
                        value={order.sale_value}
                        onChange={(e) => setOrder({ ...order, sale_value: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="submit-btn-update-order">Update Order</button>
            </form>
            {confirmationMessage && <p className="confirmation-message">{confirmationMessage}</p>}
        </div>
    );
};

export default UpdateOrder;