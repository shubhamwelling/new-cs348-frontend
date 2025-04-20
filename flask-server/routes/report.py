from flask import request, jsonify
from models import db, Order, Customer
from sqlalchemy import text
from datetime import datetime

def register_report_routes(app):
    @app.route('/reports/generate', methods=['GET'])
    def generate_report():
        start_date_str = request.args.get('start_date', type=str)
        end_date_str = request.args.get('end_date', type=str)
        min_order_size = request.args.get('min_order_size', type=float, default=None)
        min_sale_value = request.args.get('min_sale_value', type=float, default=None)

        if not start_date_str or not end_date_str:
            return jsonify({"error": "Please provide both start_date and end_date."}), 400

        try:
            start_date = datetime.strptime(start_date_str, '%Y-%m-%d %H:%M:%S')
            end_date = datetime.strptime(end_date_str, '%Y-%m-%d %H:%M:%S')
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD HH:MM:SS"}), 400

        # Prepare parameters for our prepared statements
        params = {
            'start_date': start_date,
            'end_date': end_date,
            'min_order_size': min_order_size,
            'min_sale_value': min_sale_value
        }

        # Create true prepared statements using SQLite's native parameter binding
        with db.engine.connect() as conn:
            # Detailed orders query
            orders_query = """
                SELECT o.id AS order_id, o.order_time, o.order_size, o.sale_value, 
                       c.name AS customer_name, c.company AS customer_company
                FROM orders o
                JOIN customer c ON o.customer_id = c.id
                WHERE o.order_time BETWEEN ? AND ?
                AND o.order_size >= ?
                AND o.sale_value >= ?
            """
            orders_stmt = conn.connection.cursor()
            orders_stmt.execute(orders_query, (start_date, end_date, min_order_size, min_sale_value))
            orders_rows = orders_stmt.fetchall()
            
            if not orders_rows:
                return jsonify({
                    "message": "No orders found in the given date range with the specified filters."
                }), 200

            order_data = []
            order_count = 0

            # Process each row from the orders query
            for row in orders_rows:
                order_count += 1
                order_data.append({
                    'order_id': row[0],
                    'order_time': str(row[1]),
                    'order_size': row[2],
                    'sale_value': row[3],
                    'customer_name': row[4],
                    'customer_company': row[5]
                })

            # Average order size query
            avg_order_size_query = """
                SELECT AVG(o.order_size) AS avg_order_size
                FROM orders o
                JOIN customer c ON o.customer_id = c.id
                WHERE o.order_time BETWEEN ? AND ?
                AND o.order_size >= ?
                AND o.sale_value >= ?
            """
            avg_order_size_stmt = conn.connection.cursor()
            avg_order_size_stmt.execute(avg_order_size_query, 
                                      (start_date, end_date, min_order_size, min_sale_value))
            avg_order_size_row = avg_order_size_stmt.fetchone()
            avg_order_size = avg_order_size_row[0] if avg_order_size_row else None

            # Average sale value query
            avg_sale_value_query = """
                SELECT AVG(o.sale_value) AS avg_sale_value
                FROM orders o
                JOIN customer c ON o.customer_id = c.id
                WHERE o.order_time BETWEEN ? AND ?
                AND o.order_size >= ?
                AND o.sale_value >= ?
            """
            avg_sale_value_stmt = conn.connection.cursor()
            avg_sale_value_stmt.execute(avg_sale_value_query, 
                                      (start_date, end_date, min_order_size, min_sale_value))
            avg_sale_value_row = avg_sale_value_stmt.fetchone()
            avg_sale_value = avg_sale_value_row[0] if avg_sale_value_row else None

            # Average customer age query
            avg_age_query = """
                SELECT AVG(c.age) AS avg_age
                FROM orders o
                JOIN customer c ON o.customer_id = c.id
                WHERE o.order_time BETWEEN ? AND ?
                AND o.order_size >= ?
                AND o.sale_value >= ?
                AND c.age IS NOT NULL
            """
            avg_age_stmt = conn.connection.cursor()
            avg_age_stmt.execute(avg_age_query, 
                               (start_date, end_date, min_order_size, min_sale_value))
            avg_age_row = avg_age_stmt.fetchone()
            avg_age = avg_age_row[0] if avg_age_row else None

        detailed_response = {"orders": order_data}

        aggregate_response = {
            "average_order_size": round(avg_order_size, 2) if avg_order_size is not None else None,
            "average_sale_value": round(avg_sale_value, 2) if avg_sale_value is not None else None,
            "average_age_of_customer": round(avg_age, 2) if avg_age is not None else None,
            "total_orders": order_count
        }

        return jsonify({
            "detailed_orders": detailed_response,
            "aggregate_statistics": aggregate_response
        }), 200