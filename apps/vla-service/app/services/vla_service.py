"""Service VLA principal pour l'analyse multi-modale et la génération d'UI"""

import json
import base64
from typing import Optional, Dict, Any
from openai import OpenAI
import anthropic
import google.generativeai as genai

from app.models.vla import (
    VLARequest,
    VLAResponse,
    UISpec,
    IntentType,
    ComponentSpec,
    UIStructure,
    ActionSpec,
)
from app.utils.config import settings


class VLAService:
    """Service principal pour Vision-Language-Action"""
    
    def __init__(self):
        self.openai_client = OpenAI(api_key=settings.OPENAI_API_KEY) if settings.OPENAI_API_KEY else None
        self.anthropic_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY) if settings.ANTHROPIC_API_KEY else None
        
        if settings.GOOGLE_API_KEY:
            genai.configure(api_key=settings.GOOGLE_API_KEY)
            self.gemini_model = genai.GenerativeModel('gemini-2.0-flash-exp')
        else:
            self.gemini_model = None
    
    async def process_request(self, request: VLARequest) -> VLAResponse:
        """Traiter une requête VLA"""
        
        # Déterminer le type d'intention
        intent_type = self._classify_intent(request.intent)
        
        # Générer la spécification d'UI
        if intent_type == IntentType.GENERATE_UI:
            ui_spec = await self._generate_ui_spec(request)
            return VLAResponse(
                intent_type=intent_type,
                ui_spec=ui_spec,
                message="Interface générée avec succès",
                suggestions=self._generate_suggestions(ui_spec),
            )
        
        elif intent_type == IntentType.MODIFY_UI:
            ui_spec = await self._modify_ui_spec(request)
            return VLAResponse(
                intent_type=intent_type,
                ui_spec=ui_spec,
                message="Interface modifiée avec succès",
            )
        
        elif intent_type == IntentType.ANALYZE_UI:
            analysis = await self._analyze_ui(request)
            return VLAResponse(
                intent_type=intent_type,
                message="Analyse terminée",
                metadata={"analysis": analysis},
            )
        
        else:
            return VLAResponse(
                intent_type=intent_type,
                message="Type d'intention non supporté",
            )
    
    def _classify_intent(self, intent: str) -> IntentType:
        """Classifier le type d'intention"""
        intent_lower = intent.lower()
        
        if any(word in intent_lower for word in ["créer", "générer", "faire", "afficher", "montrer"]):
            return IntentType.GENERATE_UI
        elif any(word in intent_lower for word in ["modifier", "changer", "mettre à jour", "éditer"]):
            return IntentType.MODIFY_UI
        elif any(word in intent_lower for word in ["analyser", "vérifier", "inspecter"]):
            return IntentType.ANALYZE_UI
        else:
            return IntentType.EXECUTE_ACTION
    
    async def _generate_ui_spec(self, request: VLARequest) -> UISpec:
        """Générer une spécification d'UI"""
        
        # Préparer le prompt système
        system_prompt = """Tu es un expert en génération d'interfaces utilisateur.
        
Tu dois générer une spécification JSON d'interface basée sur l'intention de l'utilisateur.

Composants disponibles:
- agi-button: Bouton (variants: primary, secondary, danger, ghost)
- agi-input: Champ de saisie (types: text, email, password, number, tel)
- agi-card: Carte de contenu (variants: default, bordered, elevated, flat)
- agi-badge: Badge de statut (variants: success, warning, error, info, neutral)
- agi-spinner: Indicateur de chargement

Réponds UNIQUEMENT avec un JSON valide au format suivant:
{
  "structure": {
    "root": {
      "type": "div",
      "props": {"className": "..."},
      "children": [...]
    },
    "layout": "vertical",
    "spacing": "medium"
  },
  "required_components": ["agi-button", "agi-input"],
  "actions": [
    {"type": "submit", "target": "form", "params": {}}
  ],
  "reasoning": "Explication de la conception",
  "confidence": 0.95
}"""
        
        # Construire les messages
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Intention: {request.intent}"}
        ]
        
        # Ajouter le screenshot si présent
        if request.screenshot and self.openai_client:
            messages[1]["content"] = [
                {"type": "text", "text": f"Intention: {request.intent}"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{request.screenshot}"
                    }
                }
            ]
        
        # Appeler le modèle
        if request.model.startswith("gpt") and self.openai_client:
            response = self.openai_client.chat.completions.create(
                model=request.model,
                messages=messages,
                response_format={"type": "json_object"},
                temperature=0.7,
            )
            spec_data = json.loads(response.choices[0].message.content)
        
        elif request.model.startswith("claude") and self.anthropic_client:
            response = self.anthropic_client.messages.create(
                model="claude-3-5-sonnet-20241022",
                max_tokens=2048,
                messages=[{"role": "user", "content": request.intent}],
            )
            spec_data = json.loads(response.content[0].text)
        
        elif request.model.startswith("gemini") and self.gemini_model:
            response = self.gemini_model.generate_content(
                f"{system_prompt}\n\n{request.intent}"
            )
            spec_data = json.loads(response.text)
        
        else:
            # Fallback: génération simple
            spec_data = self._generate_fallback_spec(request.intent)
        
        # Construire l'UISpec
        return UISpec(**spec_data)
    
    def _generate_fallback_spec(self, intent: str) -> Dict[str, Any]:
        """Génération fallback simple"""
        return {
            "structure": {
                "root": {
                    "type": "div",
                    "props": {"className": "p-6 space-y-4"},
                    "children": [
                        {
                            "type": "h2",
                            "props": {"className": "text-2xl font-bold"},
                            "children": [{"type": "text", "props": {"content": "Interface Générée"}}]
                        },
                        {
                            "type": "p",
                            "props": {"className": "text-gray-600"},
                            "children": [{"type": "text", "props": {"content": intent}}]
                        }
                    ]
                },
                "layout": "vertical",
                "spacing": "medium"
            },
            "required_components": [],
            "actions": [],
            "reasoning": "Spécification générée en mode fallback",
            "confidence": 0.5
        }
    
    async def _modify_ui_spec(self, request: VLARequest) -> UISpec:
        """Modifier une spécification d'UI existante"""
        # TODO: Implémenter la modification
        return await self._generate_ui_spec(request)
    
    async def _analyze_ui(self, request: VLARequest) -> Dict[str, Any]:
        """Analyser une interface existante"""
        # TODO: Implémenter l'analyse
        return {
            "components_detected": [],
            "layout_type": "unknown",
            "accessibility_score": 0.0,
            "suggestions": [],
            "issues": []
        }
    
    def _generate_suggestions(self, ui_spec: UISpec) -> list[str]:
        """Générer des suggestions d'amélioration"""
        suggestions = []
        
        if ui_spec.confidence < 0.8:
            suggestions.append("La spécification pourrait être améliorée avec plus de contexte")
        
        if len(ui_spec.required_components) > 10:
            suggestions.append("Interface complexe: considérer une décomposition en sous-composants")
        
        return suggestions


# Instance singleton
vla_service = VLAService()
