# 🚀 Guide de Déploiement Vercel - AGI-UI Platform

## 📋 Prérequis

- Compte Vercel (gratuit sur [vercel.com](https://vercel.com))
- Accès au repository GitHub : https://github.com/Getlood/agi-ui-platform
- Clés API pour les services IA

## 🎯 Déploiement Automatique (Recommandé)

### Étape 1 : Importer le Projet

1. Aller sur [vercel.com/new](https://vercel.com/new)
2. Cliquer sur **"Import Git Repository"**
3. Sélectionner **Getlood/agi-ui-platform**
4. Cliquer sur **"Import"**

### Étape 2 : Configurer le Projet

Dans les paramètres de configuration :

**Framework Preset:** Next.js

**Root Directory:** `apps/frontend`

**Build Command:**
```bash
cd ../.. && pnpm install && pnpm --filter @agi-ui/frontend build
```

**Output Directory:** `.next`

**Install Command:**
```bash
pnpm install
```

### Étape 3 : Variables d'Environnement

Ajouter les variables d'environnement suivantes :

#### Variables Requises

| Nom | Valeur | Description |
|-----|--------|-------------|
| `OPENAI_API_KEY` | `sk-...` | Clé API OpenAI (pour génération d'UI) |
| `GOOGLE_API_KEY` | `...` | Clé API Google (pour ORB Voice) |
| `NEXT_PUBLIC_VLA_SERVICE_URL` | `https://your-vla-service.com` | URL du service VLA (optionnel en Phase 1) |

#### Variables Optionnelles

| Nom | Valeur | Description |
|-----|--------|-------------|
| `ANTHROPIC_API_KEY` | `sk-ant-...` | Clé API Anthropic Claude |
| `NODE_ENV` | `production` | Environnement |

### Étape 4 : Déployer

1. Cliquer sur **"Deploy"**
2. Attendre 2-3 minutes
3. Votre application est en ligne ! 🎉

## 🔧 Configuration Avancée

### Domaine Personnalisé

1. Aller dans **Settings > Domains**
2. Ajouter votre domaine : `app.votre-domaine.com`
3. Configurer les DNS selon les instructions

### Optimisations

**Régions :**
- Par défaut : `iad1` (US East)
- Pour l'Europe : Ajouter `fra1` dans `vercel.json`

**Fonctions Serverless :**
- Timeout : 30s (configurable dans `vercel.json`)
- Mémoire : 1024 MB (plan Pro)

### Monitoring

Activer dans **Settings > Analytics** :
- ✅ Web Analytics
- ✅ Speed Insights
- ✅ Real User Monitoring

## 🐛 Dépannage

### Erreur : "Build failed"

**Solution :**
```bash
# Vérifier que pnpm-workspace.yaml existe
# Vérifier que le Root Directory est bien "apps/frontend"
```

### Erreur : "Module not found"

**Solution :**
```bash
# S'assurer que la commande de build inclut pnpm install à la racine
cd ../.. && pnpm install && pnpm --filter @agi-ui/frontend build
```

### Variables d'environnement non définies

**Solution :**
1. Aller dans **Settings > Environment Variables**
2. Ajouter `OPENAI_API_KEY` et `GOOGLE_API_KEY`
3. Redéployer : **Deployments > ... > Redeploy**

## 📊 Déploiement du Service VLA (Backend)

Le service VLA Python doit être déployé séparément. Options recommandées :

### Option 1 : Railway.app

```bash
# 1. Créer un compte sur railway.app
# 2. Nouveau projet depuis GitHub
# 3. Sélectionner Getlood/agi-ui-platform
# 4. Root Directory: apps/vla-service
# 5. Ajouter les variables d'environnement
# 6. Déployer
```

### Option 2 : Render.com

```bash
# 1. Créer un compte sur render.com
# 2. New Web Service
# 3. Connecter GitHub: Getlood/agi-ui-platform
# 4. Root Directory: apps/vla-service
# 5. Build Command: pip install -r requirements.txt
# 6. Start Command: uvicorn main:app --host 0.0.0.0 --port $PORT
# 7. Ajouter les variables d'environnement
# 8. Créer le service
```

### Option 3 : Google Cloud Run

```bash
# 1. Build l'image Docker
cd apps/vla-service
docker build -t gcr.io/YOUR_PROJECT/vla-service .

# 2. Push sur GCR
docker push gcr.io/YOUR_PROJECT/vla-service

# 3. Déployer sur Cloud Run
gcloud run deploy vla-service \
  --image gcr.io/YOUR_PROJECT/vla-service \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars OPENAI_API_KEY=sk-...
```

## 🔗 Connexion Frontend ↔ Backend

Une fois le VLA service déployé :

1. Copier l'URL du service (ex: `https://vla-service-xxx.railway.app`)
2. Dans Vercel, ajouter la variable :
   ```
   NEXT_PUBLIC_VLA_SERVICE_URL=https://vla-service-xxx.railway.app
   ```
3. Redéployer le frontend

## ✅ Vérification du Déploiement

### Frontend

1. Ouvrir l'URL Vercel
2. Tester la génération d'UI :
   - Entrer : "Créer un formulaire de contact"
   - Cliquer sur "Générer l'Interface"
   - Vérifier que l'UI est générée

### Backend (si déployé)

```bash
# Health check
curl https://your-vla-service.com/health

# Test API
curl -X POST https://your-vla-service.com/api/v1/vla/generate-ui-spec \
  -H "Content-Type: application/json" \
  -d '{"intent": "créer un bouton", "model": "gpt-4o"}'
```

## 🎉 Déploiement Réussi !

Votre application est maintenant en ligne et accessible publiquement.

**URLs :**
- Frontend : `https://your-app.vercel.app`
- Backend : `https://your-vla-service.railway.app` (si déployé)

## 📚 Ressources

- [Documentation Vercel](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel AI SDK](https://sdk.vercel.ai/docs)
- [Repository GitHub](https://github.com/Getlood/agi-ui-platform)

## 💬 Support

En cas de problème :
1. Vérifier les logs dans Vercel Dashboard
2. Consulter la documentation
3. Ouvrir une issue sur GitHub
