// src/services/reportService.js
import axios from 'axios';

const API_URL = 'https://cs348-backend-a1eh.onrender.com'; // Adjust this to your API URL

export const generateReport = async (startDate, endDate, minOrderSize, minSaleValue) => {
  try {
    const response = await axios.get(`${API_URL}/reports/generate`, {
      params: {
        start_date: startDate,
        end_date: endDate,
        min_order_size: minOrderSize,
        min_sale_value: minSaleValue,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error generating report');
  }
};
