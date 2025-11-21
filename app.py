
import os
from dotenv import load_dotenv
from flask import Flask, render_template, redirect, url_for, session

# Load environment variables
load_dotenv()

# Import blueprints
from blueprints.admin import admin_bp
from blueprints.citizen import citizen_bp

# App configuration
app = Flask(__name__, template_folder='Frontend', static_folder='static')
app.secret_key = os.environ.get('FLASK_SECRET', 'a_default_secret_key')

# Register blueprints
app.register_blueprint(admin_bp)
app.register_blueprint(citizen_bp)

# General routes
@app.route('/')
def index():
    """Renders the home page."""
    return render_template('index.html')

@app.route('/logout')
def logout():
    """Clears the session and redirects to the home page."""
    session.clear()
    return redirect(url_for('index'))

if __name__ == '__main__':
    app.run(debug=True)
