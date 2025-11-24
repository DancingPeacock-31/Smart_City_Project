# Smart City Management System

This project is a web-based application designed to streamline and manage various citizen services and complaints within a city. It provides separate interfaces for citizens and administrators to manage and track the lifecycle of complaints and services offered.

## Features

### Citizen Features

- **User Registration and Login:** Citizens can create an account and log in to the platform.
- **Dashboard:** After logging in, citizens can view a dashboard that displays a list of all their submitted complaints and their current statuses.
- **Submit Complaints:** Citizens can submit new complaints related to various services, providing details such as the service, a description of the issue, and the location.
- **Track Complaint Status:** Citizens can track the status of their submitted complaints (e.g., Pending, In Progress, Resolved).

### Admin Features

- **Admin Login:** Administrators have a separate login to access the admin panel.
- **Dashboard:** The admin dashboard provides a comprehensive overview of all complaints, including statistics on complaint statuses, complaints per service, and complaints by location.
- **Complaint Management:** Admins can view and manage all citizen complaints and update their statuses.
- **User Management:** Admins can view a list of all registered citizens.
- **Service Management:** Admins have full CRUD (Create, Read, Update, Delete) functionality for the services offered in the city.
- **Reporting:** A dedicated reporting section provides insights into complaint trends, including complaints by status, service, time, and location, as well as the average time to resolve a complaint.

## Tech Stack

- **Backend:**
  - Python
  - Flask
  - mysql-connector-python
- **Frontend:**
  - HTML
  - CSS
  - JavaScript
- **Database:**
  - MySQL

## Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Smart_City_Project
   ```

2. **Create and activate a virtual environment:**
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

3. **Install the dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Set up the database:**
   - Create a MySQL database.
   - Import the `schema.sql` file to set up the necessary tables:
     ```bash
     mysql -u <your-username> -p <your-database-name> < schema.sql
     ```

5. **Configure environment variables:**
   - Create a `.env` file in the root of the project.
   - Add the following environment variables:
     ```
     FLASK_SECRET=<your-flask-secret-key>
     DB_HOST=<your-database-host>
     DB_USER=<your-database-user>
     DB_PASSWORD=<your-database-password>
     DB_NAME=<your-database-name>
     FLASK_ENV=development
     ```

6. **Verify database connection (optional):**
   - To check if your database connection is configured correctly, you can run the following script:
     ```bash
     python check_db.py
     ```
     You should see a "Database connection successful!" message.

## Usage

1. **Run the application:**
   ```bash
   flask run
   ```

2. **Access the application:**
   - **Citizen Interface:** Open your web browser and go to `http://127.0.0.1:5000`
   - **Admin Interface:** Access the admin panel via `http://127.0.0.1:5000/admin/login`

## Creating an Admin User

To create an admin user, you can use the `add_admin.py` script.

1. **Set the required environment variables:**
   ```bash
   export ADMIN_PASSWORD='your_desired_admin_password'
   ```
   *(Note: The `DB_PASSWORD` should already be set in your `.env` file as per the installation instructions.)*

2. **Run the script:**
   ```bash
   python add_admin.py
   ```
   This will create an admin user with the username `admin` and the password you provided. If the user already exists, it will update the password.

## Folder Structure

```
Smart_City_Project/
├── app.py                # Main Flask application file
├── requirements.txt      # Project dependencies
├── schema.sql            # Database schema
├── .env                  # Environment variables
├── blueprints/           # Application blueprints
│   ├── admin.py          # Admin routes and logic
│   └── citizen.py        # Citizen routes and logic
├── Frontend/             # HTML templates
│   ├── admin_dashboard.html
│   ├── citizen_dashboard.html
│   └── ...
├── static/               # Static assets
│   ├── css/
│   └── js/
└── venv/                 # Virtual environment
```