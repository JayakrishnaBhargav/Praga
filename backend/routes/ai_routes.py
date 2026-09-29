"""
Praja to Policy - AI Routes
Provides automated text analysis using the LSTM sequence analyzer interface.
"""

from flask import Blueprint, request, jsonify
from services.ai.lstm_service import lstm_analyzer

ai_bp = Blueprint('ai_bp', __name__)

@ai_bp.route('/api/ai/analyze-complaint', methods=['POST'])
def analyze_complaint():
    """
    POST /api/ai/analyze-complaint
    Payload: { "description": "...", "category": "Roads" }
    Returns Demo AI Analysis clearly labelled as V1 Demo.
    """
    data = request.get_json() or {}
    description = data.get('description', '').strip()
    category = data.get('category', 'Other')

    if not description:
        return jsonify({"error": "Complaint description is required for analysis"}), 400

    analysis_result = lstm_analyzer.analyze(description, category)
    return jsonify(analysis_result), 200
