from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.security import check_password_hash
from .db import get_db_connection

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM admin WHERE username = %s", (username,))
            admin = cursor.fetchone()
        finally:
            db.close()
        
        if admin and check_password_hash(admin['password'], password):
            session['admin_id'] = admin['admin_id']
            return redirect(url_for('admin.dashboard'))
        else:
            return "Invalid credentials"
    return render_template('admin_login.html')

@admin_bp.route('/dashboard')
def dashboard():
    if 'admin_id' in session:
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT c.*, ci.name, s.service_name FROM complaint c JOIN citizen ci ON c.citizen_id = ci.citizen_id JOIN service s ON c.service_id = s.service_id")
            all_complaints = cursor.fetchall()
            
            # For stats cards
            cursor.execute("SELECT status, COUNT(*) as count FROM complaint GROUP BY status")
            status_data = cursor.fetchall()
            status_counts = {item['status']: item['count'] for item in status_data}

            # For charts
            cursor.execute("SELECT s.service_name, COUNT(*) as count FROM complaint c JOIN service s ON c.service_id = s.service_id GROUP BY s.service_name")
            service_data = cursor.fetchall()
            service_chart_labels = [item['service_name'] for item in service_data]
            service_chart_data = [item['count'] for item in service_data]

            # Complaints by location
            cursor.execute("SELECT location, COUNT(*) as count FROM complaint GROUP BY location")
            complaints_by_location = cursor.fetchall()
        finally:
            db.close()
        
        return render_template(
            'admin_dashboard.html', 
            all_complaints=all_complaints, 
            status_counts=status_counts,
            status_data=status_data, # Still needed for the status chart
            service_chart_labels=service_chart_labels,
            service_chart_data=service_chart_data,
            complaints_by_location=complaints_by_location,
            show_sidebar=True
        )
    return redirect(url_for('admin.login'))

@admin_bp.route('/update_status/<int:complaint_id>/<string:status>', methods=['POST'])
def update_status(complaint_id, status):
    if 'admin_id' in session:
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("UPDATE complaint SET status = %s WHERE complaint_id = %s", (status, complaint_id))
            db.commit()
        finally:
            db.close()
        return redirect(url_for('admin.dashboard'))
    return redirect(url_for('admin.login'))

@admin_bp.route('/users')
def users():
    if 'admin_id' in session:
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM citizen")
            all_users = cursor.fetchall()
        finally:
            db.close()
        return render_template('admin_users.html', all_users=all_users, show_sidebar=True)
    return redirect(url_for('admin.login'))

@admin_bp.route('/services')
def services():
    if 'admin_id' in session:
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM service")
            all_services = cursor.fetchall()
        finally:
            db.close()
        return render_template('admin_services.html', all_services=all_services, show_sidebar=True)
    return redirect(url_for('admin.login'))

@admin_bp.route('/services/add', methods=['POST'])
def add_service():
    if 'admin_id' in session:
        service_name = request.form['service_name']
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("INSERT INTO service (service_name) VALUES (%s)", (service_name,))
            db.commit()
        finally:
            db.close()
        return redirect(url_for('admin.services'))
    return redirect(url_for('admin.login'))

@admin_bp.route('/services/edit/<int:service_id>', methods=['POST'])
def edit_service(service_id):
    if 'admin_id' in session:
        service_name = request.form['service_name']
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("UPDATE service SET service_name = %s WHERE service_id = %s", (service_name, service_id))
            db.commit()
        finally:
            db.close()
        return redirect(url_for('admin.services'))
    return redirect(url_for('admin.login'))

@admin_bp.route('/services/delete/<int:service_id>', methods=['POST'])
def delete_service(service_id):
    if 'admin_id' in session:
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("DELETE FROM service WHERE service_id = %s", (service_id,))
            db.commit()
        finally:
            db.close()
        return redirect(url_for('admin.services'))
    return redirect(url_for('admin.login'))

@admin_bp.route('/reports')
def reports():
    if 'admin_id' in session:
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)

            # Complaints by status
            cursor.execute("SELECT status, COUNT(*) as count FROM complaint GROUP BY status")
            status_data = cursor.fetchall()
            complaints_by_status = {item['status']: item['count'] for item in status_data} if status_data else {}

            # Complaints by service
            cursor.execute("SELECT s.service_name, COUNT(*) as count FROM complaint c JOIN service s ON c.service_id = s.service_id GROUP BY s.service_name")
            service_data = cursor.fetchall()
            complaints_by_service = {item['service_name']: item['count'] for item in service_data} if service_data else {}

            # Complaints over time
            cursor.execute("SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM complaint GROUP BY month ORDER BY month")
            complaints_over_time_data = cursor.fetchall()
            complaints_over_time = {item['month']: item['count'] for item in complaints_over_time_data} if complaints_over_time_data else {}

            # Complaints by location
            cursor.execute("SELECT location, COUNT(*) as count FROM complaint GROUP BY location")
            location_data = cursor.fetchall()
            complaints_by_location = {item['location']: item['count'] for item in location_data} if location_data else {}

            # Average resolution time
            cursor.execute("SELECT DATEDIFF(updated_at, created_at) as resolution_days FROM complaint WHERE status = 'Resolved' AND updated_at IS NOT NULL AND created_at IS NOT NULL")
            resolution_time_data = cursor.fetchall()
            avg_resolution_days = [item['resolution_days'] for item in resolution_time_data] if resolution_time_data else []

        finally:
            db.close()
        
        return render_template(
            'admin_reports.html', 
            complaints_by_status=complaints_by_status,
            complaints_by_service=complaints_by_service,
            complaints_over_time=complaints_over_time,
            complaints_by_location=complaints_by_location,
            avg_resolution_days=avg_resolution_days,
            show_sidebar=True
        )
    return redirect(url_for('admin.login'))
