"""
Praja to Policy – Public Insight and Governance
Flask REST API Entry Point

Architecture:
Citizen / Employee / Admin Frontends
            │
            ▼  (REST API calls)
      Flask REST API
     ┌──────┴────────────────────────┐
     ▼                               ▼
MySQL Database (or Supabase)    AI Service (LSTM Sequence Classifier)
"""

import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# Load blueprints
from routes.auth_routes import auth_bp
from routes.complaint_routes import complaint_bp
from routes.scheme_routes import scheme_bp
from routes.ai_routes import ai_bp

load_dotenv()

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'praja_policy_backend_secret_2026')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET', 'praja_jwt_token_secret')

# Register blueprints
app.register_blueprint(auth_bp)
app.register_blueprint(complaint_bp)
app.register_blueprint(scheme_bp)
app.register_blueprint(ai_bp)

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "service": "Praja to Policy Flask REST API",
        "version": "1.0.0",
        "ai_status": "Demo AI Analysis Active (LSTM Planned for V2)"
    }), 200

if __name__ == '__main__':
    port = int(os.getenv('FLASK_PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
