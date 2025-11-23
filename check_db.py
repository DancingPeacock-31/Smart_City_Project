
import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

try:
    db = mysql.connector.connect(
        host=os.environ.get('DB_HOST'),
        user=os.environ.get('DB_USER'),
        password=os.environ.get('DB_PASSWORD'),
        database=os.environ.get('DB_NAME')
    )
    print("Database connection successful!")
    db.close()
except mysql.connector.Error as err:
    print(f"Database connection failed: {err}")
