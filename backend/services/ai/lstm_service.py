"""
Praja to Policy - Deep Learning Architecture: LSTM Sequential Text Classifier (Planned for V2)

Architecture Design:
User Complaint Text
      ↓
Text Preprocessing (Tokenization, Lemmatization, Stopword removal, Embedding lookup)
      ↓
Bi-directional LSTM Layers (Sequential context & semantic feature capture)
      ↓
Multi-head Dense Heads:
  ├─> Category Classifier (Roads, Water, Electricity, Sanitation, Healthcare, etc.)
  ├─> Sentiment Analyzer (Negative, Strongly Negative, Neutral)
  ├─> Urgency Estimator (High, Medium, Low)
  └─> Priority Scorer (Critical, High, Medium, Low)
      ↓
Database & Direct Routing to Government Employee Desk

Current Version: V1 (Demo AI Analysis Architecture)
Notice: The actual LSTM weights and recurrent training pipeline will be deployed in V2.
This class provides the exact interface contract for zero-downtime hot-swap.
"""

import re
from typing import Dict, Any

class LSTMComplaintAnalyzer:
    """
    Modular LSTM service stub and preprocessing pipeline container.
    In V1, it uses intelligent rule-based heuristic extraction to simulate
    the sequential text classifier's outputs for demonstration and testing.
    """

    CATEGORIES = [
        "Roads", "Water", "Electricity", "Sanitation",
        "Healthcare", "Education", "Transport", "Public Safety", "Other"
    ]

    KEYWORDS = {
        "Roads": ["road", "pothole", "tar", "asphalt", "traffic", "signal", "pavement", "highway", "flyover", "street", "footpath", "speed breaker"],
        "Water": ["water", "leak", "pipeline", "drinking", "contamination", "drainage", "tap", "borewell", "supply", "pressure", "sewage"],
        "Electricity": ["electricity", "power", "transformer", "wire", "blackout", "pole", "voltage", "current", "spark", "meter", "load shedding"],
        "Sanitation": ["garbage", "trash", "waste", "cleaning", "drain", "mosquito", "smell", "dump", "stagnant", "gutter", "debris"],
        "Healthcare": ["hospital", "clinic", "doctor", "medicine", "health", "ambulance", "phc", "beds", "nurse", "treatment"],
        "Education": ["school", "college", "teacher", "books", "classroom", "desk", "midday meal", "fees", "student"],
        "Transport": ["bus", "depot", "auto", "metro", "fare", "route", "conductor", "stop", "station"],
        "Public Safety": ["police", "safety", "theft", "crime", "harassment", "light", "security", "dark", "encroachment"]
    }

    URGENT_WORDS = ["accident", "fire", "danger", "burst", "death", "hazard", "sparking", "overflow", "urgent", "immediate", "emergency", "broken", "critical", "severe", "life threatening"]

    def __init__(self, model_weights_path: str = None):
        self.model_weights_path = model_weights_path
        self.is_v2_lstm_loaded = False  # V2 flag

    def preprocess_text(self, text: str) -> str:
        """Sequential text cleaning for tokenization pipeline."""
        text = text.lower()
        text = re.sub(r'[^a-zA-Z0-9\s]', ' ', text)
        text = re.sub(r'\s+', ' ', text).strip()
        return text

    def analyze(self, description: str, user_category: str = None) -> Dict[str, Any]:
        """
        Processes complaint text and outputs Demo AI Analysis.
        Returns category, sentiment, urgency, priority, confidence, and generated summary.
        """
        cleaned = self.preprocess_text(description)
        words = set(cleaned.split())

        # Determine Category
        detected_category = user_category if user_category and user_category in self.CATEGORIES else "Other"
        category_scores = {}
        for cat, keywords in self.KEYWORDS.items():
            matches = sum(1 for kw in keywords if kw in cleaned)
            if matches > 0:
                category_scores[cat] = matches

        if category_scores:
            best_cat = max(category_scores, key=category_scores.get)
            if not user_category or user_category == "Other":
                detected_category = best_cat

        # Sentiment Analysis
        has_strong_neg = any(w in cleaned for w in ["terrible", "worst", "unacceptable", "dangerous", "corrupt", "disaster", "dying"])
        sentiment = "Strongly Negative" if has_strong_neg else "Negative"

        # Urgency & Priority Detection
        urgency_matches = sum(1 for uw in self.URGENT_WORDS if uw in cleaned)
        if urgency_matches >= 2 or "emergency" in cleaned or "danger" in cleaned:
            urgency = "High"
            priority = "Critical"
            confidence = 94.8
        elif urgency_matches == 1:
            urgency = "High"
            priority = "High"
            confidence = 91.2
        elif len(cleaned.split()) > 15:
            urgency = "Medium"
            priority = "Medium"
            confidence = 88.5
        else:
            urgency = "Low"
            priority = "Low"
            confidence = 82.0

        # Generate concise summary
        sentences = [s.strip() for s in description.replace('\n', '. ').split('.') if len(s.strip()) > 3]
        summary = sentences[0] if sentences else description[:80]
        if len(summary) > 120:
            summary = summary[:117] + "..."

        return {
            "summary": f"Civic report regarding {detected_category.lower()} issue: {summary}",
            "category": detected_category,
            "sentiment": sentiment,
            "urgency": urgency,
            "priority": priority,
            "confidence": confidence,
            "model_version": "V1 (Demo AI Analysis – LSTM Sequence Architecture Planned for V2)",
            "is_demo_analysis": True,
            "notice": "Demo AI Analysis. LSTM sequential text classifier will be integrated in V2."
        }

# Global singleton instance for injection
lstm_analyzer = LSTMComplaintAnalyzer()
