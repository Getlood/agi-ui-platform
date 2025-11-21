'use server';

import { streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

/**
 * Génère une interface utilisateur à partir d'un prompt texte
 */
export async function generateInterface(prompt: string) {
  const result = await streamUI({
    model: openai('gpt-4o'),
    prompt: `Tu es un expert en génération d'interfaces utilisateur.
    
Génère une interface React moderne et professionnelle basée sur cette demande: "${prompt}"

Utilise les composants Web Components disponibles:
- <agi-button variant="primary|secondary|danger|ghost" label="..." />
- <agi-input label="..." type="text|email|password" placeholder="..." />
- <agi-card variant="default|bordered|elevated">...</agi-card>
- <agi-badge variant="success|warning|error|info" label="..." />

Règles:
1. Utilise Tailwind CSS pour le style
2. Crée une interface responsive et accessible
3. Ajoute des interactions appropriées
4. Utilise les composants AGI quand c'est pertinent`,
    
    text: ({ content }) => <div className="prose max-w-none">{content}</div>,
    
    tools: {
      showForm: {
        description: 'Afficher un formulaire avec des champs',
        parameters: z.object({
          title: z.string().describe('Titre du formulaire'),
          fields: z.array(
            z.object({
              name: z.string(),
              label: z.string(),
              type: z.enum(['text', 'email', 'password', 'number', 'tel']),
              placeholder: z.string().optional(),
              required: z.boolean().default(false),
            })
          ),
          submitLabel: z.string().default('Envoyer'),
        }),
        generate: async function* ({ title, fields, submitLabel }) {
          yield <div className="animate-pulse">Génération du formulaire...</div>;
          
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          return (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <form className="space-y-4">
                {fields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    <input
                      type={field.type}
                      name={field.name}
                      placeholder={field.placeholder}
                      required={field.required}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200 outline-none transition-all"
                    />
                  </div>
                ))}
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transition-all"
                >
                  {submitLabel}
                </button>
              </form>
            </div>
          );
        },
      },
      
      showCard: {
        description: 'Afficher une carte avec du contenu',
        parameters: z.object({
          title: z.string(),
          description: z.string(),
          imageUrl: z.string().optional(),
          actions: z.array(
            z.object({
              label: z.string(),
              variant: z.enum(['primary', 'secondary', 'danger']),
            })
          ).optional(),
        }),
        generate: async function* ({ title, description, imageUrl, actions }) {
          yield <div className="animate-pulse">Génération de la carte...</div>;
          
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          return (
            <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-md">
              {imageUrl && (
                <img
                  src={imageUrl}
                  alt={title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-6 space-y-4">
                <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
                <p className="text-gray-600">{description}</p>
                {actions && actions.length > 0 && (
                  <div className="flex gap-3 pt-4">
                    {actions.map((action, i) => (
                      <button
                        key={i}
                        className={`px-4 py-2 rounded-lg font-medium transition-all ${
                          action.variant === 'primary'
                            ? 'bg-purple-600 text-white hover:bg-purple-700'
                            : action.variant === 'secondary'
                            ? 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        },
      },
      
      showDashboard: {
        description: 'Afficher un tableau de bord avec des statistiques',
        parameters: z.object({
          title: z.string(),
          metrics: z.array(
            z.object({
              label: z.string(),
              value: z.string(),
              change: z.string().optional(),
              trend: z.enum(['up', 'down', 'neutral']).optional(),
            })
          ),
        }),
        generate: async function* ({ title, metrics }) {
          yield <div className="animate-pulse">Génération du tableau de bord...</div>;
          
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          return (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((metric, i) => (
                  <div
                    key={i}
                    className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-100 hover:border-purple-300 transition-all"
                  >
                    <div className="text-sm text-gray-500 mb-2">{metric.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {metric.value}
                    </div>
                    {metric.change && (
                      <div
                        className={`text-sm font-medium ${
                          metric.trend === 'up'
                            ? 'text-green-600'
                            : metric.trend === 'down'
                            ? 'text-red-600'
                            : 'text-gray-600'
                        }`}
                      >
                        {metric.trend === 'up' && '↑ '}
                        {metric.trend === 'down' && '↓ '}
                        {metric.change}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },
      
      showList: {
        description: 'Afficher une liste d\'éléments',
        parameters: z.object({
          title: z.string(),
          items: z.array(
            z.object({
              title: z.string(),
              description: z.string().optional(),
              status: z.enum(['todo', 'inprogress', 'done']).optional(),
            })
          ),
        }),
        generate: async function* ({ title, items }) {
          yield <div className="animate-pulse">Génération de la liste...</div>;
          
          await new Promise((resolve) => setTimeout(resolve, 500));
          
          return (
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
              <div className="space-y-2">
                {items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white p-4 rounded-lg border-2 border-gray-200 hover:border-purple-300 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        defaultChecked={item.status === 'done'}
                        className="mt-1 w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
                      />
                      <div className="flex-1">
                        <div
                          className={`font-medium ${
                            item.status === 'done'
                              ? 'line-through text-gray-400'
                              : 'text-gray-900'
                          }`}
                        >
                          {item.title}
                        </div>
                        {item.description && (
                          <div className="text-sm text-gray-500 mt-1">
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.status && (
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            item.status === 'done'
                              ? 'bg-green-100 text-green-700'
                              : item.status === 'inprogress'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status === 'done'
                            ? 'Terminé'
                            : item.status === 'inprogress'
                            ? 'En cours'
                            : 'À faire'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },
    },
  });

  return result.value;
}
