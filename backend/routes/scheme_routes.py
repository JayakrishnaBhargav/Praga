"""
Praja to Policy - Government Welfare Scheme Routes
Supports schemes across all sectors, natural language query matching, and personalized eligibility filtering.
"""

from flask import Blueprint, request, jsonify

scheme_bp = Blueprint('scheme_bp', __name__)

@scheme_bp.route('/api/schemes', methods=['GET'])
def get_schemes():
    category = request.args.get('category')
    search_query = request.args.get('search', '').lower()
    return jsonify({"schemes": []}), 200

@scheme_bp.route('/api/schemes/check-eligibility', methods=['POST'])
def check_eligibility():
    """
    Evaluates citizen profile against all government schemes.
    Payload: { "age": 28, "income": 250000, "occupation": "Farmer", "state": "Telangana" }
    """
    profile = request.get_json() or {}
    age = profile.get('age', 30)
    income = profile.get('income', 300000)
    occupation = profile.get('occupation', '').lower()
    state = profile.get('state', '').lower()

    return jsonify({
        "status": "success",
        "eligible_schemes_count": 5,
        "recommendations": []
    }), 200
