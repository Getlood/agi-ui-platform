"""Pydantic models for VLA service"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from enum import Enum


class IntentType(str, Enum):
    """Type d'intention utilisateur"""
    GENERATE_UI = "generate_ui"
    MODIFY_UI = "modify_ui"
    ANALYZE_UI = "analyze_ui"
    EXECUTE_ACTION = "execute_action"


class ComponentType(str, Enum):
    """Types de composants UI"""
    ATOM = "atom"
    MOLECULE = "molecule"
    ORGANISM = "organism"
    TEMPLATE = "template"


class VLARequest(BaseModel):
    """Requête VLA"""
    intent: str = Field(..., description="Intention de l'utilisateur en langage naturel")
    screenshot: Optional[str] = Field(None, description="Screenshot de l'UI actuelle (base64)")
    current_state: Optional[Dict[str, Any]] = Field(None, description="État actuel de l'application")
    context: Optional[Dict[str, Any]] = Field(None, description="Contexte additionnel")
    model: Optional[str] = Field("gpt-4o", description="Modèle LLM à utiliser")


class ComponentSpec(BaseModel):
    """Spécification d'un composant"""
    type: str = Field(..., description="Type de composant (agi-button, agi-input, etc.)")
    props: Dict[str, Any] = Field(default_factory=dict, description="Propriétés du composant")
    children: Optional[List['ComponentSpec']] = Field(None, description="Composants enfants")
    slot: Optional[str] = Field(None, description="Nom du slot si applicable")


class UIStructure(BaseModel):
    """Structure de l'interface utilisateur"""
    root: ComponentSpec = Field(..., description="Composant racine")
    layout: str = Field("vertical", description="Type de layout (vertical, horizontal, grid)")
    spacing: str = Field("medium", description="Espacement entre éléments")


class ActionSpec(BaseModel):
    """Spécification d'une action"""
    type: str = Field(..., description="Type d'action (click, submit, navigate, etc.)")
    target: str = Field(..., description="Cible de l'action")
    params: Optional[Dict[str, Any]] = Field(None, description="Paramètres de l'action")


class UISpec(BaseModel):
    """Spécification complète de l'interface"""
    structure: UIStructure = Field(..., description="Structure de l'UI")
    required_components: List[str] = Field(..., description="Liste des composants nécessaires")
    actions: List[ActionSpec] = Field(default_factory=list, description="Actions associées")
    reasoning: str = Field(..., description="Raisonnement de l'IA")
    confidence: float = Field(..., ge=0.0, le=1.0, description="Niveau de confiance")


class VLAResponse(BaseModel):
    """Réponse VLA"""
    intent_type: IntentType = Field(..., description="Type d'intention détecté")
    ui_spec: Optional[UISpec] = Field(None, description="Spécification de l'UI générée")
    message: Optional[str] = Field(None, description="Message pour l'utilisateur")
    suggestions: List[str] = Field(default_factory=list, description="Suggestions d'amélioration")
    metadata: Dict[str, Any] = Field(default_factory=dict, description="Métadonnées additionnelles")


class AnalysisResult(BaseModel):
    """Résultat d'analyse d'UI"""
    components_detected: List[str] = Field(..., description="Composants détectés")
    layout_type: str = Field(..., description="Type de layout détecté")
    accessibility_score: float = Field(..., ge=0.0, le=1.0, description="Score d'accessibilité")
    suggestions: List[str] = Field(default_factory=list, description="Suggestions d'amélioration")
    issues: List[str] = Field(default_factory=list, description="Problèmes détectés")


# Pour la récursivité
ComponentSpec.model_rebuild()
