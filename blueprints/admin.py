from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.security import check_password_hash
import mysql.connector
import os

admin_bp = Blueprint('admin', __name__, url_prefix='/admin')

def get_db_connection():
    return mysql.connector.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        database=os.environ.get('DB_NAME')
    )

@admin_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM admin WHERE username = %s", (username,))
        admin = cursor.fetchone()
        db.close()
        
        if admin and check_password_hash(admin[2], password):
            session['admin_id'] = admin[0]
            return redirect(url_for('admin.dashboard'))
        else:
            return "Invalid credentials"
    return render_template('admin_login.html')

@admin_bp.route('/dashboard')
def dashboard():
    if 'admin_id' in session:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT c.*, ci.name, s.service_name FROM complaint c JOIN citizen ci ON c.citizen_id = ci.citizen_id JOIN service s ON c.service_id = s.service_id")
        all_complaints = cursor.fetchall()
        
        # For charts
        cursor.execute("SELECT status, COUNT(*) as count FROM complaint GROUP BY status")
        status_data = cursor.fetchall()
        
        cursor.execute("SELECT s.service_name, COUNT(*) as count FROM complaint c JOIN service s ON c.service_id = s.service_id GROUP BY s.service_name")
        service_data = cursor.fetchall()

        cursor.execute("SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM complaint GROUP BY month ORDER BY month")
        complaints_over_time_data = cursor.fetchall()

        cursor.execute("SELECT location, COUNT(*) as count FROM complaint GROUP BY location")
        complaints_by_location = cursor.fetchall()

        cursor.execute("SELECT s.service_name, AVG(DATEDIFF(updated_at, created_at)) FROM complaint c JOIN service s ON c.service_id = s.service_id WHERE status = 'Resolved' GROUP BY s.service_name")
        resolution_time_data = cursor.fetchall()
        db.close()
        
        return render_template(
            'admin_dashboard.html', 
            all_complaints=all_complaints, 
            status_data=status_data, 
            service_data=service_data, 
            complaints_over_time_data=complaints_over_time_data,
            complaints_by_location=complaints_by_location,
            resolution_time_data=resolution_time_data
        )
    return redirect(url_for('admin.login'))

@admin_bp.route('/update_status/<int:complaint_id>/<string:status>', methods=['POST'])
def update_status(complaint_id, status):
    if 'admin_id' in session:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("UPDATE complaint SET status = %s WHERE complaint_id = %s", (status, complaint_id))
        db.commit()
        db.close()
        return redirect(url_for('admin.dashboard'))
    return redirect(url_for('admin.login'))

@admin_bp.route('/users')
def users():
    if 'admin_id' in session:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM citizen")
        all_users = cursor.fetchall()
        db.close()
        return render_template('admin_users.html', all_users=all_users)
    return redirect(url_for('admin.login'))

@admin_bp.route('/services')
def services():
    if 'admin_id' in session:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("SELECT * FROM service")
        all_services = cursor.fetchall()
        db.close()
        return render_template('admin_services.html', all_services=all_services)
    return redirect(url_for('admin.login'))

@admin_bp.route('/services/add', methods=['POST'])
def add_service():
    if 'admin_id' in session:
        service_name = request.form['service_name']
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("INSERT INTO service (service_name) VALUES (%s)", (service_name,))
        db.commit()
        db.close()
        return redirect(url_for('admin.services'))
    return redirect(url_for('admin.login'))

@admin_bp.route('/services/edit/<int:service_id>', methods=['POST'])
def edit_service(service_id):
    if 'admin_id' in session:
        service_name = request.form['service_name']
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("UPDATE service SET service_name = %s WHERE service_id = %s", (service_name, service_id))
        db.commit()
        db.close()
        return redirect(url_for('admin.services'))
    return redirect(url_for('admin.login'))

@admin_bp.route('/services/delete/<int:service_id>', methods=['POST'])
def delete_service(service_id):
    if 'admin_id' in session:
        db = get_db_connection()
        cursor = db.cursor()
        cursor.execute("DELETE FROM service WHERE service_id = %s", (service_id,))
        db.commit()
        db.close()
        return redirect(url_for('admin.services'))
    return redirect(url_for('admin.login'))

@admin_bp.route('/reports')
def reports():
    if 'admin_id' in session:
        db = get_db_connection()
        cursor = db.cursor()

        # Complaints by status
        cursor.execute("SELECT status, COUNT(*) as count FROM complaint GROUP BY status")
        status_data = cursor.fetchall()
        
        # Complaints by service
        cursor.execute("SELECT s.service_name, COUNT(*) as count FROM complaint c JOIN service s ON c.service_id = s.service_id GROUP BY s.service_name")
        service_data = cursor.fetchall()

        # Complaints over time
        cursor.execute("SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count FROM complaint GROUP BY month ORDER BY month")
        complaints_over_time_data = cursor.fetchall()

        # Complaints by location
        cursor.execute("SELECT location, COUNT(*) as count FROM complaint GROUP BY location")
        complaints_by_location = cursor.fetchall()

        # Average resolution time
        cursor.execute("SELECT s.service_name, AVG(DATEDIFF(updated_at, created_at)) FROM complaint c JOIN service s ON c.service_id = s.service_id WHERE status = 'Resolved' GROUP BY s.service_name")
        resolution_time_data = cursor.fetchall()
        
        db.close()
        
        return render_template(
            'admin_reports.html', 
            status_data=status_data, 
            service_data=service_data, 
            complaints_over_time_data=complaints_over_time_data,
            complaints_by_location=complaints_by_location,
            resolution_time_data=resolution_time_data
        )
    return redirect(url_for('admin.login'))
