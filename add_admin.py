
from werkzeug.security import generate_password_hash
import mysql.connector
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- IMPORTANT: SET YOUR ENVIRONMENT VARIABLES ---
# Before running this script, ensure you have set the following environment variables:
#
#   export DB_PASSWORD='your_mysql_password'
#   export ADMIN_PASSWORD='your_desired_admin_password'
#
# If these variables are not set, the script will fail.
# ----------------------------------------------------

# Get credentials from environment variables
db_password = os.environ.get('DB_PASSWORD')
new_password = os.environ.get('ADMIN_PASSWORD')
new_username = 'admin'

# --- VALIDATION ---
if not db_password or not new_password:
    print("Error: Required environment variables 'DB_PASSWORD' and 'ADMIN_PASSWORD' are not set.")
    print("Please set these variables before running the script.")
    exit(1)
# --------------------

try:
    # Establish database connection
    db = mysql.connector.connect(
        host=os.environ.get('DB_HOST', 'localhost'),
        user=os.environ.get('DB_USER', 'root'),
        password=db_password,
        database=os.environ.get('DB_NAME', 'smart_city_db')
    )
    cursor = db.cursor()

    # Hash the new password
    hashed_password = generate_password_hash(new_password)

    # Check if the admin user already exists
    cursor.execute("SELECT * FROM admin WHERE username = %s", (new_username,))
    if cursor.fetchone():
        # If user exists, update the password
        update_query = "UPDATE admin SET password = %s WHERE username = %s"
        cursor.execute(update_query, (hashed_password, new_username))
        print(f"Admin user '{new_username}' already existed. Password has been updated to '{new_password}'.")
    else:
        # If user does not exist, insert a new admin record
        insert_query = "INSERT INTO admin (username, password, email) VALUES (%s, %s, %s)"
        admin_email = 'admin@smartcity.com'
        cursor.execute(insert_query, (new_username, hashed_password, admin_email))
        print(f"Successfully created new admin user '{new_username}' with password '{new_password}'.")

    # Commit the changes to the database
    db.commit()

except mysql.connector.Error as err:
    print(f"Database Error: {err}")
    print("Please ensure your MySQL server is running and the credentials in the script are correct.")

finally:
    # Close the cursor and connection
    if 'db' in locals() and db.is_connected():
        cursor.close()
        db.close()
        print("Database connection closed.")

