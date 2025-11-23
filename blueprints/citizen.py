from flask import Blueprint, render_template, request, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from .db import get_db_connection

citizen_bp = Blueprint('citizen', __name__, url_prefix='/citizen')

@citizen_bp.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        name = request.form['name']
        email = request.form['email']
        phone = request.form['phone']
        password = generate_password_hash(request.form['password'])
        
        db = get_db_connection()
        try:
            cursor = db.cursor()
            cursor.execute(
                "INSERT INTO citizen (name, email, phone, password) VALUES (%s, %s, %s, %s)",
                (name, email, phone, password)
            )
            db.commit()
        finally:
            db.close()
        return redirect(url_for('citizen.login'))
    return render_template('citizen_register.html')

@citizen_bp.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)
            cursor.execute("SELECT * FROM citizen WHERE email = %s", (email,))
            citizen = cursor.fetchone()
        finally:
            db.close()
        
        if citizen and check_password_hash(citizen['password'], password):
            session['citizen_id'] = citizen['citizen_id']
            return redirect(url_for('citizen.dashboard'))
        else:
            return "Invalid credentials"
    return render_template('citizen_login.html')

@citizen_bp.route('/dashboard')
def dashboard():
    if 'citizen_id' in session:
        citizen_id = session['citizen_id']
        db = get_db_connection()
        try:
            cursor = db.cursor(dictionary=True)

            # Fetch complaints for the citizen
            cursor.execute("SELECT c.*, s.service_name FROM complaint c JOIN service s ON c.service_id = s.service_id WHERE c.citizen_id = %s", (citizen_id,))
            complaints = cursor.fetchall()

            # Fetch all available services for the dropdown
            cursor.execute("SELECT * FROM service")
            services = cursor.fetchall()

            # Calculate status counts for the chart
            status_counts = {}
            for complaint in complaints:
                status = complaint['status']
                status_counts[status] = status_counts.get(status, 0) + 1
        finally:
            db.close()
        return render_template('citizen_dashboard.html', complaints=complaints, services=services, status_counts=status_counts, show_sidebar=False)
    return redirect(url_for('citizen.login'))

@citizen_bp.route('/submit_complaint', methods=['POST'])
def submit_complaint():
    if 'citizen_id' in session:
        service_id = request.form['service_id']
        description = request.form['description']
        location = request.form['location']
        citizen_id = session['citizen_id']
        
        db = get_db_connection()
        try:
            cursor = db.cursor()
            cursor.execute(
                "INSERT INTO complaint (citizen_id, service_id, description, location) VALUES (%s, %s, %s, %s)",
                (citizen_id, service_id, description, location)
            )
            db.commit()
        finally:
            db.close()
        return redirect(url_for('citizen.dashboard'))
    return redirect(url_for('citizen.login'))
