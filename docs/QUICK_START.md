# Guide de Démarrage Rapide - AGI-UI Platform

## 🚀 Installation Locale

### Prérequis

- Node.js 20+
- Python 3.11+
- pnpm 8+
- Docker (optionnel, pour Kubernetes local)

### Installation

```bash
# Cloner le repository
git clone https://github.com/votre-org/agi-ui-platform.git
cd agi-ui-platform

# Installer les dépendances
pnpm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos clés API
```

### Configuration

Éditez le fichier `.env` avec vos clés API :

```env
# OpenAI
OPENAI_API_KEY=sk-...

# Google Gemini
GOOGLE_API_KEY=...

# Anthropic Claude
ANTHROPIC_API_KEY=sk-ant-...
```

### Lancement en Développement

#### Option 1 : Lancer tous les services

```bash
pnpm dev
```

Cela démarre :
- Frontend Next.js sur `http://localhost:3000`
- Service VLA sur `http://localhost:8000`

#### Option 2 : Lancer les services individuellement

**Frontend :**
```bash
cd apps/frontend
pnpm dev
```

**Service VLA :**
```bash
cd apps/vla-service
python -m venv venv
source venv/bin/activate  # Sur Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Composants UI (Storybook) :**
```bash
cd packages/ui-components
pnpm storybook
```

## 🎯 Premiers Pas

### 1. Générer votre première interface

1. Ouvrez `http://localhost:3000`
2. Dans le champ de texte, entrez : "Créer un formulaire de contact avec nom, email et message"
3. Cliquez sur "Générer l'Interface"
4. Admirez l'interface générée en temps réel ! ✨

### 2. Utiliser le contrôle vocal

```typescript
import { OrbVoice } from '@agi-ui/orb-voice';

const orb = new OrbVoice({
  apiKey: 'YOUR_GOOGLE_API_KEY',
  onAction: async (action) => {
    if (action.type === 'generate_ui') {
      // Générer l'interface
      const ui = await generateInterface(action.target);
      // Afficher l'UI
    }
  },
});

// Démarrer l'écoute
await orb.startListening();

// Dire : "Orb, créer un tableau de bord"
```

### 3. Utiliser les composants atomiques

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module">
    import '@agi-ui/components';
  </script>
</head>
<body>
  <agi-button variant="primary" label="Cliquez-moi"></agi-button>
  
  <agi-input 
    label="Email" 
    type="email" 
    placeholder="votre@email.com"
    required
  ></agi-input>
  
  <agi-card variant="elevated">
    <div slot="header">
      <h3>Titre de la carte</h3>
    </div>
    <p>Contenu de la carte</p>
  </agi-card>
</body>
</html>
```

## 🧪 Tests

```bash
# Tests unitaires
pnpm test

# Tests E2E
pnpm test:e2e

# Tests de composants
cd packages/ui-components
pnpm test
```

## 📦 Build de Production

```bash
# Build tous les packages
pnpm build

# Build frontend uniquement
pnpm --filter @agi-ui/frontend build

# Build composants uniquement
pnpm --filter @agi-ui/components build
```

## 🚢 Déploiement

### Vercel (Recommandé pour le frontend)

```bash
# Installer Vercel CLI
pnpm add -g vercel

# Déployer
cd apps/frontend
vercel deploy --prod
```

### Docker

```bash
# Build les images
docker build -t agi-ui-frontend -f apps/frontend/Dockerfile .
docker build -t agi-ui-vla-service -f apps/vla-service/Dockerfile apps/vla-service

# Lancer avec Docker Compose
docker-compose up -d
```

### Kubernetes

```bash
# Installer avec Helm
helm install agi-ui-platform ./infrastructure/kubernetes/helm/agi-ui-platform \
  --namespace agi-ui \
  --create-namespace \
  --set global.domain=your-domain.com
```

## 🐛 Dépannage

### Le frontend ne démarre pas

```bash
# Nettoyer et réinstaller
rm -rf node_modules .next
pnpm install
pnpm dev
```

### Le service VLA ne répond pas

```bash
# Vérifier les logs
cd apps/vla-service
python main.py

# Vérifier les clés API
echo $OPENAI_API_KEY
```

### Les composants ne s'affichent pas

```bash
# Rebuild les composants
cd packages/ui-components
pnpm build
```

## 📚 Ressources

- [Documentation complète](./README.md)
- [Architecture](./docs/architecture.md)
- [API Reference](./docs/api-reference.md)
- [Composants UI](http://localhost:6006) (Storybook)
- [Exemples](./examples/)

## 💬 Support

- 📧 Email: support@agi-ui-platform.com
- 💬 Discord: [Rejoindre](https://discord.gg/agi-ui)
- 🐛 Issues: [GitHub](https://github.com/votre-org/agi-ui-platform/issues)
