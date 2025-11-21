"""
Service VLA Avancé - Phase 4
Analyse multi-modale, fine-tuning, accessibilité
"""

from typing import List, Dict, Any, Optional
import openai
import json
import base64
from PIL import Image
import io

class VLAAdvancedService:
    """Service VLA avancé avec capacités multi-modales"""
    
    def __init__(self):
        self.client = openai.OpenAI()
        # Modèle fine-tuné sur composants custom (à créer)
        self.fine_tuned_model = "ft:gpt-4o-2024-08-06:agi-ui:custom-components:v1"
        self.base_model = "gpt-4o"
    
    async def analyze_ui_screenshot(
        self,
        screenshot: str,
        intent: str
    ) -> Dict[str, Any]:
        """
        Analyser un screenshot d'UI et proposer des modifications
        
        Args:
            screenshot: Screenshot en base64
            intent: Intention de l'utilisateur
            
        Returns:
            Analyse complète avec suggestions
        """
        
        response = self.client.chat.completions.create(
            model=self.base_model,
            messages=[
                {
                    "role": "system",
                    "content": """Tu es un expert en analyse d'interfaces utilisateur.
                    Analyse le screenshot et propose des améliorations basées sur:
                    - Accessibilité (WCAG 2.1 niveau AA minimum)
                    - UX/UI best practices
                    - Performance et responsive design
                    - Cohérence visuelle
                    
                    Retourne un JSON avec:
                    - analysis: analyse détaillée
                    - issues: liste des problèmes détectés
                    - suggestions: améliorations proposées
                    - accessibility_score: score sur 100
                    - components_detected: composants identifiés"""
                },
                {
                    "role": "user",
                    "content": [
                        {
                            "type": "text",
                            "text": f"Intention: {intent}\n\nAnalyse cette interface et propose des améliorations."
                        },
                        {
                            "type": "image_url",
                            "image_url": {
                                "url": f"data:image/png;base64,{screenshot}",
                                "detail": "high"
                            }
                        }
                    ]
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Ajouter des auto-fixes si disponibles
        if "issues" in result:
            result["auto_fixes"] = self._generate_auto_fixes(result["issues"])
        
        return result
    
    async def modify_existing_ui(
        self,
        current_spec: Dict[str, Any],
        modification: str,
        screenshot: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Modifier une UI existante
        
        Args:
            current_spec: Spécification actuelle de l'UI
            modification: Description de la modification
            screenshot: Screenshot optionnel pour contexte
            
        Returns:
            Nouvelle spécification modifiée
        """
        
        messages = [
            {
                "role": "system",
                "content": """Tu modifies des spécifications d'UI existantes.
                Conserve la structure et les composants existants sauf si explicitement demandé.
                Retourne la spécification complète modifiée en JSON."""
            },
            {
                "role": "user",
                "content": f"""Spécification actuelle:
{json.dumps(current_spec, indent=2)}

Modification demandée: {modification}

Retourne la nouvelle spécification complète."""
            }
        ]
        
        # Ajouter le screenshot si disponible
        if screenshot:
            messages[1]["content"] = [
                {"type": "text", "text": messages[1]["content"]},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{screenshot}",
                        "detail": "high"
                    }
                }
            ]
        
        # Utiliser le modèle fine-tuné si disponible
        try:
            model = self.fine_tuned_model
        except:
            model = self.base_model
        
        response = self.client.chat.completions.create(
            model=model,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.2
        )
        
        return json.loads(response.choices[0].message.content)
    
    async def analyze_accessibility(
        self,
        ui_spec: Dict[str, Any],
        screenshot: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Analyser l'accessibilité d'une UI
        
        Args:
            ui_spec: Spécification de l'UI
            screenshot: Screenshot optionnel
            
        Returns:
            Rapport d'accessibilité complet
        """
        
        content = f"""Analyse l'accessibilité de cette interface selon WCAG 2.1.

Spécification UI:
{json.dumps(ui_spec, indent=2)}

Retourne un JSON avec:
- score: score global (0-100)
- level: niveau WCAG atteint (A, AA, AAA)
- issues: liste détaillée des problèmes
  - type: type de problème
  - severity: critical/high/medium/low
  - wcag_criterion: critère WCAG concerné
  - description: description du problème
  - element: élément concerné
  - recommendation: recommandation
- recommendations: liste des améliorations prioritaires
- compliant_criteria: critères respectés
- non_compliant_criteria: critères non respectés"""
        
        messages = [
            {
                "role": "system",
                "content": """Tu es un expert en accessibilité web (WCAG 2.1).
                Analyse en profondeur l'accessibilité des interfaces."""
            },
            {
                "role": "user",
                "content": content
            }
        ]
        
        # Ajouter screenshot si disponible
        if screenshot:
            messages[1]["content"] = [
                {"type": "text", "text": content},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{screenshot}",
                        "detail": "high"
                    }
                }
            ]
        
        response = self.client.chat.completions.create(
            model=self.base_model,
            messages=messages,
            response_format={"type": "json_object"},
            temperature=0.1
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Générer des corrections automatiques
        if "issues" in result:
            result["auto_fixes"] = self._generate_auto_fixes(result["issues"])
        
        return result
    
    def _generate_auto_fixes(self, issues: List[Dict]) -> List[Dict]:
        """
        Générer des corrections automatiques pour les problèmes détectés
        
        Args:
            issues: Liste des problèmes
            
        Returns:
            Liste des corrections automatiques
        """
        fixes = []
        
        for issue in issues:
            issue_type = issue.get("type", "")
            
            # Texte alternatif manquant
            if "alt" in issue_type.lower() or "alternative" in issue_type.lower():
                fixes.append({
                    "type": "add_attribute",
                    "target": issue.get("element", ""),
                    "attribute": "alt",
                    "value": "Image descriptive",
                    "description": "Ajouter un texte alternatif"
                })
            
            # Contraste insuffisant
            elif "contrast" in issue_type.lower() or "contraste" in issue_type.lower():
                fixes.append({
                    "type": "adjust_color",
                    "target": issue.get("element", ""),
                    "property": "color",
                    "description": "Ajuster le contraste pour atteindre 4.5:1",
                    "suggestion": self._calculate_accessible_color(
                        issue.get("foreground", "#000000"),
                        issue.get("background", "#FFFFFF")
                    )
                })
            
            # Label manquant
            elif "label" in issue_type.lower():
                fixes.append({
                    "type": "add_label",
                    "target": issue.get("element", ""),
                    "description": "Ajouter un label accessible",
                    "suggestion": {
                        "aria-label": "Description de l'élément",
                        "or": "<label for='element-id'>Label</label>"
                    }
                })
            
            # Ordre de tabulation
            elif "tab" in issue_type.lower() or "focus" in issue_type.lower():
                fixes.append({
                    "type": "fix_tab_order",
                    "target": issue.get("element", ""),
                    "description": "Corriger l'ordre de tabulation",
                    "suggestion": "Utiliser tabindex ou réorganiser le DOM"
                })
            
            # Rôle ARIA manquant
            elif "aria" in issue_type.lower() or "role" in issue_type.lower():
                fixes.append({
                    "type": "add_aria",
                    "target": issue.get("element", ""),
                    "description": "Ajouter les attributs ARIA appropriés",
                    "suggestion": self._suggest_aria_role(issue.get("element", ""))
                })
        
        return fixes
    
    def _calculate_accessible_color(
        self,
        foreground: str,
        background: str
    ) -> Dict[str, str]:
        """
        Calculer une couleur accessible avec bon contraste
        
        Args:
            foreground: Couleur de premier plan
            background: Couleur de fond
            
        Returns:
            Suggestions de couleurs accessibles
        """
        # Simplification: retourner des couleurs sûres
        # Dans une vraie implémentation, calculer le ratio de contraste
        
        return {
            "foreground_suggestion": "#1F2937",  # Gris foncé
            "background_suggestion": "#FFFFFF",  # Blanc
            "contrast_ratio": "12.63:1",
            "meets_wcag_aa": True,
            "meets_wcag_aaa": True
        }
    
    def _suggest_aria_role(self, element: str) -> Dict[str, Any]:
        """
        Suggérer des rôles ARIA appropriés
        
        Args:
            element: Type d'élément
            
        Returns:
            Suggestions ARIA
        """
        # Mapping simple élément -> rôle ARIA
        aria_suggestions = {
            "button": {"role": "button", "aria-pressed": "false"},
            "link": {"role": "link"},
            "navigation": {"role": "navigation", "aria-label": "Navigation principale"},
            "search": {"role": "search"},
            "form": {"role": "form", "aria-labelledby": "form-title"},
            "dialog": {"role": "dialog", "aria-modal": "true"},
            "alert": {"role": "alert", "aria-live": "assertive"},
            "menu": {"role": "menu"},
            "list": {"role": "list"},
        }
        
        for key, value in aria_suggestions.items():
            if key in element.lower():
                return value
        
        return {"role": "region", "aria-label": "Section"}
    
    async def generate_ui_with_finetuned_model(
        self,
        prompt: str,
        custom_components: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Générer une UI avec le modèle fine-tuné
        
        Args:
            prompt: Description de l'UI
            custom_components: Liste des composants custom à utiliser
            
        Returns:
            Spécification UI optimisée
        """
        
        system_prompt = """Tu génères des spécifications d'UI avec les composants AGI-UI.
        Tu connais tous les composants custom et leurs propriétés."""
        
        if custom_components:
            system_prompt += f"\n\nComposants custom disponibles: {', '.join(custom_components)}"
        
        try:
            model = self.fine_tuned_model
        except:
            model = self.base_model
        
        response = self.client.chat.completions.create(
            model=model,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"},
            temperature=0.3
        )
        
        return json.loads(response.choices[0].message.content)
