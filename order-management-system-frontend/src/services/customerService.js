import axios from 'axios';

const API_URL = 'http://localhost:5000/customers';  // Ensure this matches your Flask backend

// Get all customers
const getAllCustomers = async () => {
    return axios.get(`${API_URL}/`);
};

// Get a single customer by ID
const getCustomer = async (customerId) => {
    return axios.get(`${API_URL}/${customerId}`);
};

// Add a new customer
const addCustomer = async (customerData) => {
    return axios.post(`${API_URL}/add`, customerData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

// Update an existing customer
const updateCustomer = async (customerId, customerData) => {
    return axios.put(`${API_URL}/update/${customerId}`, customerData, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
};

// Delete a customer by ID
const deleteCustomer = async (customerId) => {
    return axios.delete(`${API_URL}/delete/${customerId}`);
};

export default {
    getAllCustomers,
    getCustomer,
    addCustomer,
    updateCustomer,
    deleteCustomer,
};