'use client';

import { useState } from 'react';
import { generateInterface } from '@/actions/ui-generation';
import { AgiButton, AgiInput } from '@agi-ui/components';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [generatedUI, setGeneratedUI] = useState<React.ReactNode>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    try {
      const ui = await generateInterface(prompt);
      setGeneratedUI(ui);
    } catch (error) {
      console.error('Erreur de génération:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  AGI-UI Platform
                </h1>
                <p className="text-sm text-gray-500">Génération d'interfaces par IA</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900">
                Documentation
              </button>
              <button className="px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Connexion
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
              Créez des Interfaces avec l'IA
            </h2>
            <p className="text-xl text-gray-600">
              Décrivez ce que vous voulez, l'IA génère l'interface en temps réel
            </p>
          </div>

          {/* Input Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Décrivez l'interface que vous souhaitez créer
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Ex: Créer un formulaire de contact avec nom, email et message..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all resize-none"
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleGenerate}
                disabled={loading || !prompt.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Génération en cours...
                  </span>
                ) : (
                  '✨ Générer l'Interface'
                )}
              </button>
              <button
                onClick={() => {
                  setPrompt('');
                  setGeneratedUI(null);
                }}
                className="px-6 py-3 border-2 border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all"
              >
                Réinitialiser
              </button>
            </div>
          </div>

          {/* Generated UI Section */}
          {generatedUI && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  Interface Générée
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  ✓ Succès
                </span>
              </div>
              <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 bg-gray-50">
                {generatedUI}
              </div>
            </div>
          )}

          {/* Examples */}
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Exemples de prompts
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'Créer un formulaire de connexion avec email et mot de passe',
                'Afficher une carte de profil utilisateur avec photo et informations',
                'Générer un tableau de bord avec graphiques de ventes',
                'Créer une liste de tâches avec cases à cocher',
              ].map((example, i) => (
                <button
                  key={i}
                  onClick={() => setPrompt(example)}
                  className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all"
                >
                  <span className="text-sm text-gray-700">{example}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
