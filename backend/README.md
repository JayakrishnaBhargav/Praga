# Praja to Policy – Public Insight and Governance (Flask Backend)

This is the independent Python Flask backend application for the Praja to Policy e-governance platform.

## Architecture
- **Framework**: Python 3.10+, Flask 3.0+
- **REST Endpoints**: Auth (JWT), Civic Complaints, Direct Routing to Department Officers, Scheme Explorer & Eligibility, Demo AI Analysis
- **Database**: MySQL / Supabase relational tables (`users`, `complaints`, `schemes`, `complaint_status_history`)
- **AI Service**: Modular LSTM sequential text architecture (`backend/services/ai/lstm_service.py`), ready for full V2 LSTM weights integration.

## Directory Structure
```
backend/
├── app.py                     # Main Flask Application
├── requirements.txt           # Python dependencies
├── models/
│   ├── __init__.py
│   └── models.py              # MySQL table schemas & constraints
├── routes/
│   ├── __init__.py
│   ├── auth_routes.py         # Citizen, Employee & Admin auth
│   ├── complaint_routes.py    # Direct officer routing & complaints
│   ├── scheme_routes.py       # Scheme catalog & eligibility calculation
│   └── ai_routes.py           # Demo AI text analysis endpoint
└── services/
    ├── __init__.py
    └── ai/
        ├── __init__.py
        └── lstm_service.py    # Modular LSTM preprocessing and inference interface
```

## Running the Flask Backend
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py
```
API runs on `http://localhost:5000`
