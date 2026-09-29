"""
Praja to Policy - Authentication Routes
Citizen Registration, Citizen Login, Government Employee Login (with Employee Code), and Admin Login.
"""

from flask import Blueprint, request, jsonify
import jwt
import datetime
import os

auth_bp = Blueprint('auth_bp', __name__)
JWT_SECRET = os.getenv('JWT_SECRET', 'praja_to_policy_secret_jwt_key_2026')

@auth_bp.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    name = data.get('name')
    email = data.get('email')
    phone = data.get('phone')
    password = data.get('password')
    age = data.get('age')
    occupation = data.get('occupation')
    income = data.get('income')
    state = data.get('state')
    district = data.get('district')
    city = data.get('city')

    if not all([name, email, password]):
        return jsonify({"error": "Name, email, and password are required"}), 400

    token = jwt.encode({
        "email": email,
        "role": "citizen",
        "name": name,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "message": "Citizen registration successful",
        "token": token,
        "user": {
            "name": name,
            "email": email,
            "phone": phone,
            "role": "citizen",
            "age": age,
            "occupation": occupation,
            "income": income,
            "state": state,
            "district": district,
            "city": city
        }
    }), 201

@auth_bp.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    role = "admin" if "admin" in email.lower() else "citizen"
    token = jwt.encode({
        "email": email,
        "role": role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "email": email,
            "role": role,
            "name": "Administrative Officer" if role == "admin" else "Verified Citizen"
        }
    }), 200

@auth_bp.route('/api/auth/employee-login', methods=['POST'])
def employee_login():
    """
    Government Employee login with dedicated Official Employee Code
    """
    data = request.get_json() or {}
    employee_code = data.get('employee_code')
    password = data.get('password')
    department = data.get('department')

    if not employee_code or not password:
        return jsonify({"error": "Official Employee Code and password are required"}), 400

    token = jwt.encode({
        "employee_code": employee_code,
        "role": "employee",
        "department": department or "Public Works",
        "exp": datetime.datetime.utcnow() + datetime.timedelta(days=7)
    }, JWT_SECRET, algorithm="HS256")

    return jsonify({
        "token": token,
        "user": {
            "employee_code": employee_code,
            "role": "employee",
            "name": f"Officer {employee_code}",
            "department": department or "Public Works",
            "designation": "Executive Field Officer"
        }
    }), 200
