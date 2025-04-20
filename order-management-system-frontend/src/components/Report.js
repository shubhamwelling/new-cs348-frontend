import React, { useState } from 'react';
import { generateReport } from '../services/reportService';
import './Report.css'; // Import the CSS file

const Report = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [minOrderSize, setMinOrderSize] = useState('');
  const [minSaleValue, setMinSaleValue] = useState('');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState(null);

  const formatDateTime = (dt) => {
    return dt ? dt.replace("T", " ") + ":00" : "";
  };

  const formatOrderTime = (time) => {
    return new Date(time).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    });
  };

  const handleGenerateReport = async () => {
    if (!startDate || !endDate) {
      setError('Please provide both start and end dates.');
      return;
    }

    setError(null);
    try {
      const formattedStart = formatDateTime(startDate);
      const formattedEnd = formatDateTime(endDate);

      const numericMinOrderSize = minOrderSize ? parseFloat(minOrderSize) : undefined;
      const numericMinSaleValue = minSaleValue ? parseFloat(minSaleValue) : undefined;

      const report = await generateReport(
        formattedStart,
        formattedEnd,
        numericMinOrderSize,
        numericMinSaleValue
      );

      setReportData(report);
    } catch (err) {
      console.error(err);
      setError('Failed to generate report. Please try again later.');
    }
  };

  return (
    <div className="report-container">
      <h2 className="report-title">Generate Report</h2>

      <div className="input-group">
        <div className="input-field">
          <label>Start Date:</label>
          <input
            type="datetime-local"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="input-field">
          <label>End Date:</label>
          <input
            type="datetime-local"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      <div className="input-group">
        <div className="input-field">
          <label>Min Order Size (Reams):</label>
          <input
            type="number"
            value={minOrderSize}
            onChange={(e) => setMinOrderSize(e.target.value)}
            placeholder="Enter min order size"
          />
        </div>
        <div className="input-field">
          <label>Min Sale Value ($):</label>
          <input
            type="number"
            value={minSaleValue}
            onChange={(e) => setMinSaleValue(e.target.value)}
            placeholder="Enter min sale value"
          />
        </div>
      </div>

      <button className="generate-btn" onClick={handleGenerateReport}>Generate Report</button>

      {error && <p className="error">{error}</p>}

      {reportData && (
        <div className="report-results">
          <h3 className="results-title">Report Results</h3>

          {/* Orders Section */}
          <div className="orders-section">
            <h4>Orders</h4>
            {!reportData.detailed_orders ? (
              <p className="no-data">No orders found for the selected criteria.</p>
            ) : (
              <div className="order-container">
                {reportData.detailed_orders.orders.map((order) => (
                  <div key={order.order_id} className="order-card">
                    <div className="order-details">
                      <p><strong>Customer:</strong> {order.customer_name}</p>
                      <p><strong>Company:</strong> {order.customer_company}</p>
                      <p><strong>Time:</strong> {formatOrderTime(order.order_time)}</p>
                      <p><strong>Size (Reams):</strong> {order.order_size}</p>
                      <p><strong>Sale Value ($):</strong> ${order.sale_value.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Statistics Section */}
          <div className="statistics-section">
            <h4>📈 Statistics</h4>
            {!reportData.aggregate_statistics ? (
              <p className="no-data">No statistics available for the selected criteria.</p>
            ) : (
              <div className="statistics-grid">
                <div className="stat-card">
                  <strong>Avg. Order Size (Reams)</strong>
                  <p>{reportData.aggregate_statistics.average_order_size} Reams</p>
                </div>
                <div className="stat-card">
                  <strong>Avg. Sale Value ($)</strong>
                  <p>${reportData.aggregate_statistics.average_sale_value.toFixed(2)}</p>
                </div>
                <div className="stat-card">
                  <strong>Avg. Customer Age</strong>
                  <p>{reportData.aggregate_statistics.average_age_of_customer} yrs</p>
                </div>
                <div className="stat-card">
                  <strong>Total Orders</strong>
                  <p>{reportData.aggregate_statistics.total_orders}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;