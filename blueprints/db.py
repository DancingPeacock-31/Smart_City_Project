import mysql.connector.pooling
import os

pool = None

def create_pool():
    """Creates the database connection pool."""
    global pool
    pool = mysql.connector.pooling.MySQLConnectionPool(
        pool_name="smart_city_pool",
        pool_size=5,
        pool_reset_session=True,
        host=os.environ.get('DB_HOST', 'localhost'),
        user=os.environ.get('DB_USER', 'root'),
        password=os.environ.get('DB_PASSWORD'),
        database=os.environ.get('DB_NAME', 'smart_city_db')
    )

def get_db_connection():
    """Gets a connection from the pool."""
    if pool is None:
        raise Exception("Connection pool not initialized. Call create_pool() first.")
    return pool.get_connection()