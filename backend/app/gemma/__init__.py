"""PRAVAHA Gemma 4 AI Reporting Package"""
from backend.app.gemma.schema import InvestigationReport, HotspotFinding, CandidateBottleneck, ReportGenerationRequest
from backend.app.gemma.client import gemma_generator, GemmaReportGenerator

__all__ = [
    "InvestigationReport",
    "HotspotFinding",
    "CandidateBottleneck",
    "ReportGenerationRequest",
    "gemma_generator",
    "GemmaReportGenerator",
]
