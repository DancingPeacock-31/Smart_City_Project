# Smart City Management System

A full-stack web application for managing citizen complaints and public services.

## Features

- Citizen registration and login
- Submit and track complaints
- Admin dashboard to manage all complaints
- Analytics with charts for complaint status and service types

## Technologies Used

- **Backend**: Flask (Python)
- **Frontend**: HTML, CSS, Bootstrap, Chart.js
- **Database**: MySQL

## How to Run

1. **Install MySQL** and create the `smart_city_db` database with the required tables.
2. **Install Python dependencies**: `pip install -r requirements.txt`
3. **Configure database credentials** in `app.py`.
4. **Run the Flask server**: `python app.py`
5. **Access in browser**: `http://localhost:5000`

## Commands for terminal to run this project


1. cd "/Users/shubhamgupta/Desktop/DBMS Project /Smart_City_Project"

2. source venv/bin/activate

3. export DB_HOST=localhost
   export DB_USER=root
   export DB_PASSWORD='Shub#@3107'
   export DB_NAME=smart_city_db
   export FLASK_SECRET='a_very_secret_key'

4. python3 "/Users/shubhamgupta/Desktop/DBMS Project /Smart_City_Project/add_admin.py"

5. Admin Login Credentials
   **Username**: admin
   **Password**: password