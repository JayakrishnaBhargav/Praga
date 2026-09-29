"""
AI Service Package for Praja to Policy.
Houses sequence models, text preprocessing pipelines, and inference architecture.
"""
from .lstm_service import LSTMComplaintAnalyzer

__all__ = ['LSTMComplaintAnalyzer']
