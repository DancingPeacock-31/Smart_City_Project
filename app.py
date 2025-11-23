
import os
from dotenv import load_dotenv
from flask import Flask, render_template, redirect, url_for, session

from flask_wtf.csrf import CSRFProtect

# Load environment variables
load_dotenv()

# Import and initialize the database connection pool
from blueprints import db
db.create_pool()

# Import blueprints
from blueprints.admin import admin_bp
from blueprints.citizen import citizen_bp

# App configuration
app = Flask(__name__, template_folder='Frontend', static_folder='static')
app.secret_key = os.environ.get('FLASK_SECRET')
csrf = CSRFProtect(app)

# Register blueprints
app.register_blueprint(admin_bp)
app.register_blueprint(citizen_bp)

# General routes
@app.route('/')
def index():
    """Renders the home page."""
    return render_template('index.html', is_landing_page=True)

@app.route('/logout')
def logout():
    """Clears the session and redirects to the home page."""
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    debug_mode = os.environ.get('FLASK_ENV') == 'development'
    app.run(debug=debug_mode)
