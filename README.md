# Praja to Policy – Public Insight and Governance

An intelligent, transparent e-governance platform connecting citizens with government authorities.

## System Architecture

```
                    PRAJA TO POLICY
                           │
                           ▼
                  ┌─────────────────┐
                  │ React Frontend  │
                  │ TypeScript      │
                  │ Tailwind CSS    │
                  └────────┬────────┘
                           │ REST API
                           ▼
                  ┌─────────────────┐
                  │ Flask Backend   │
                  │ Python          │
                  │ JWT Auth        │
                  └────────┬────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
      ┌─────────────┐           ┌──────────────┐
      │    MySQL    │           │  AI Service  │
      │   Database  │           │              │
      └─────────────┘           │ Future LSTM  │
                                └──────────────┘
```

## User Roles
1. **Citizen**:
   - Register with socio-economic profile (Age, Income, Occupation, Location)
   - Submit civic grievances with direct photo/video attachments
   - Real-time Demo AI Analysis (Category, Sentiment, Urgency, Priority, Confidence)
   - Direct routing to assigned department officer desk without mediator
   - Live status tracking with milestone timeline
   - Government Scheme discovery with automated personal eligibility matcher

2. **Government Employee**:
   - Secure login with Official Employee Code (e.g. `EMP-RD-101`) & designated Department
   - Dedicated direct officer desk with citizen grievances in their jurisdiction
   - Review uploaded photos/videos of civic issues
   - Update grievance status (Under Review, In Progress, Resolved) with official action notes

3. **Government Admin**:
   - High-level governance dashboard with live metrics
   - Analytics charts: Category breakdown, Priority matrix, Status distribution, Timeline trends
   - Reassign grievances, oversee department employees, monitor resolution velocity

## Deep Learning / AI Architecture
- **V1 (Current)**: Demo AI Analysis modular architecture (`/api/ai/analyze-complaint`) providing category categorization, sentiment analysis, urgency detection, and priority assignment.
- **V2 (Planned)**: Full Bi-directional LSTM sequential text classifier integrated via `backend/services/ai/lstm_service.py`.
