import axios from 'axios';

const API_URL = 'http://localhost:5000/orders';

const getAllOrders = async () => {
    return axios.get(API_URL);
};

const getOrder = async (orderId) => {
    console.log("Getting order with id:", orderId);
    return axios.get(`${API_URL}/${orderId}`);
};

const addOrder = async (orderData) => {
    console.log("Sending order data to backend:", orderData);  // Debugging log
    return axios.post(`${API_URL}/add`, orderData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const updateOrder = async (orderId, orderData) => {
    console.log("Updating order with data:", orderData);  // Debugging log
    return axios.put(`${API_URL}/update/${orderId}`, orderData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

const deleteOrder = async (orderId) => {
    return axios.delete(`${API_URL}/delete/${orderId}`);
};

export default {
    getAllOrders,
    getOrder,
    addOrder,
    updateOrder,
    deleteOrder,
};
