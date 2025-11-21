"""Routes API pour le service VLA"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from typing import List

from app.models.vla import VLARequest, VLAResponse
from app.services.vla_service import vla_service

router = APIRouter()


@router.post("/generate-ui-spec", response_model=VLAResponse)
async def generate_ui_spec(request: VLARequest):
    """
    Générer une spécification d'interface utilisateur
    
    Args:
        request: Requête VLA avec l'intention de l'utilisateur
        
    Returns:
        VLAResponse avec la spécification d'UI générée
    """
    try:
        response = await vla_service.process_request(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-ui")
async def analyze_ui(request: VLARequest):
    """
    Analyser une interface utilisateur existante
    
    Args:
        request: Requête VLA avec screenshot de l'UI
        
    Returns:
        Résultat de l'analyse
    """
    try:
        request.intent = "Analyser cette interface"
        response = await vla_service.process_request(request)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/components")
async def list_components():
    """
    Lister tous les composants disponibles
    
    Returns:
        Liste des composants avec leurs métadonnées
    """
    # TODO: Charger depuis le fichier de métadonnées
    return {
        "components": [
            {
                "name": "agi-button",
                "type": "atom",
                "description": "Bouton interactif",
                "variants": ["primary", "secondary", "danger", "ghost"]
            },
            {
                "name": "agi-input",
                "type": "atom",
                "description": "Champ de saisie",
                "types": ["text", "email", "password", "number", "tel"]
            },
            {
                "name": "agi-card",
                "type": "molecule",
                "description": "Carte de contenu",
                "variants": ["default", "bordered", "elevated", "flat"]
            },
            {
                "name": "agi-badge",
                "type": "atom",
                "description": "Badge de statut",
                "variants": ["success", "warning", "error", "info", "neutral"]
            }
        ]
    }
