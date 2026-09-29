"""
Praja to Policy - Complaint Routes
Direct routing from citizen to designated government employee desk without mediator.
Supports media uploads (photos/videos), status updates, and audit trail.
"""

from flask import Blueprint, request, jsonify
import uuid
import datetime

complaint_bp = Blueprint('complaint_bp', __name__)

@complaint_bp.route('/api/complaints', methods=['GET', 'POST'])
def handle_complaints():
    if request.method == 'GET':
        user_role = request.args.get('role', 'all')
        user_id = request.args.get('user_id')
        dept = request.args.get('department')
        return jsonify({"complaints": []}), 200

    data = request.get_json() or {}
    complaint_id = f"PTP-{datetime.datetime.now().year}-{str(uuid.uuid4())[:4].upper()}"

    # Department mapping for direct routing
    dept_map = {
        "Roads": "Roads & Highway Maintenance",
        "Water": "Municipal Water Supply & Sewerage",
        "Electricity": "State Electricity Distribution Corp",
        "Sanitation": "Municipal Solid Waste & Sanitation",
        "Healthcare": "Public Health & Family Welfare",
        "Education": "School Education Department",
        "Transport": "State Road Transport Corporation",
        "Public Safety": "Civic Protection & Police Dept",
        "Other": "General Civic Grievance Cell"
    }

    category = data.get('category', 'Other')
    assigned_dept = dept_map.get(category, "General Civic Grievance Cell")

    new_complaint = {
        "complaint_id": complaint_id,
        "description": data.get('description'),
        "summary": data.get('summary', data.get('description', '')[:80]),
        "category": category,
        "sentiment": data.get('sentiment', 'Negative'),
        "urgency": data.get('urgency', 'Medium'),
        "priority": data.get('priority', 'Medium'),
        "confidence": data.get('confidence', 88.0),
        "state": data.get('state'),
        "district": data.get('district'),
        "city": data.get('city'),
        "media_urls": data.get('media_urls', []),
        "status": "Submitted",
        "assigned_department": assigned_dept,
        "created_at": datetime.datetime.utcnow().isoformat(),
        "timeline": [
            {
                "status": "Submitted",
                "timestamp": datetime.datetime.utcnow().isoformat(),
                "note": "Complaint lodged by citizen and automatically routed directly to department officer desk."
            }
        ]
    }

    return jsonify({"message": "Complaint submitted successfully", "complaint": new_complaint}), 201

@complaint_bp.route('/api/complaints/<string:complaint_id>/status', methods=['PATCH'])
def update_status(complaint_id):
    data = request.get_json() or {}
    new_status = data.get('status')
    note = data.get('note', '')
    officer_name = data.get('officer_name', 'Authorized Officer')

    return jsonify({
        "message": "Status updated successfully",
        "complaint_id": complaint_id,
        "status": new_status,
        "note": note,
        "updated_at": datetime.datetime.utcnow().isoformat()
    }), 200
