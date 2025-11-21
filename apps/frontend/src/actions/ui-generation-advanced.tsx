'use server';

import { streamUI } from 'ai/rsc';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { Suspense } from 'react';

// Composants de chargement
function LoadingSkeleton({ count = 1 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}

function SkeletonForm({ fields }: { fields: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i}>
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      ))}
      <div className="h-10 bg-blue-200 rounded w-32"></div>
    </div>
  );
}

// Composant de champ de formulaire
function FormField({ field }: { field: any }) {
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500";
  
  return (
    <div className="form-field">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {field.type === 'textarea' ? (
        <textarea
          className={inputClass}
          placeholder={field.placeholder}
          required={field.required}
          rows={4}
        />
      ) : field.type === 'select' ? (
        <select className={inputClass} required={field.required}>
          <option value="">Sélectionner...</option>
          {field.options?.map((opt: string, i: number) => (
            <key={i} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type || 'text'}
          className={inputClass}
          placeholder={field.placeholder}
          required={field.required}
        />
      )}
      {field.helperText && (
        <p className="text-sm text-gray-500 mt-1">{field.helperText}</p>
      )}
    </div>
  );
}

/**
 * Génération d'interface avancée avec streaming et animations
 */
export async function generateInterfaceAdvanced(prompt: string) {
  const result = await streamUI({
    model: openai('gpt-4o'),
    system: `Tu es un expert en génération d'interfaces utilisateur.
    Génère des interfaces modernes, accessibles et réactives.
    Utilise les composants AGI-UI quand c'est possible.
    Retourne toujours du JSX valide avec Tailwind CSS.`,
    prompt: `Génère une interface pour: ${prompt}`,
    
    text: ({ content, done }) => {
      if (!done) {
        return (
          <Suspense fallback={<LoadingSkeleton />}>
            <div className="streaming-content animate-pulse text-gray-600">
              {content}
            </div>
          </Suspense>
        );
      }
      return (
        <div className="final-content animate-fadeIn">
          {content}
        </div>
      );
    },
    
    tools: {
      // Génération progressive de formulaire
      generateForm: {
        description: 'Générer un formulaire avec champs',
        parameters: z.object({
          title: z.string().describe('Titre du formulaire'),
          fields: z.array(z.object({
            name: z.string(),
            type: z.enum(['text', 'email', 'password', 'number', 'tel', 'url', 'textarea', 'select']),
            label: z.string(),
            placeholder: z.string().optional(),
            required: z.boolean().default(false),
            helperText: z.string().optional(),
            options: z.array(z.string()).optional(),
          })),
          submitLabel: z.string().default('Envoyer'),
        }),
        generate: async function* ({ title, fields, submitLabel }) {
          // Yield skeleton initial
          yield (
            <div className="form-container max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-6 animate-fadeIn">{title}</h2>
              <SkeletonForm fields={fields.length} />
            </div>
          );
          
          // Attendre pour l'animation
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Générer chaque champ progressivement
          const renderedFields = [];
          for (let i = 0; i < fields.length; i++) {
            renderedFields.push(fields[i]);
            
            yield (
              <div className="form-container max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>
                <form className="space-y-4">
                  {renderedFields.map((field, idx) => (
                    <div
                      key={idx}
                      className="animate-slideIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      <FormField field={field} />
                    </div>
                  ))}
                </form>
              </div>
            );
            
            await new Promise(resolve => setTimeout(resolve, 150));
          }
          
          // Version finale avec bouton
          return (
            <div className="form-container max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">{title}</h2>
              <form className="space-y-4">
                {fields.map((field, i) => (
                  <FormField key={i} field={field} />
                ))}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors animate-slideUp"
                >
                  {submitLabel}
                </button>
              </form>
            </div>
          );
        },
      },
      
      // Génération de cartes
      generateCards: {
        description: 'Générer une grille de cartes',
        parameters: z.object({
          title: z.string().describe('Titre de la section'),
          cards: z.array(z.object({
            title: z.string(),
            description: z.string(),
            image: z.string().optional(),
            link: z.string().optional(),
          })),
        }),
        generate: async function* ({ title, cards }) {
          // Skeleton initial
          yield (
            <div className="cards-container p-6">
              <h2 className="text-2xl font-bold mb-6 animate-fadeIn">{title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                    <div className="p-4 bg-white rounded-b-lg">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Générer progressivement
          const renderedCards = [];
          for (let i = 0; i < cards.length; i++) {
            renderedCards.push(cards[i]);
            
            yield (
              <div className="cards-container p-6">
                <h2 className="text-2xl font-bold mb-6">{title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {renderedCards.map((card, idx) => (
                    <div
                      key={idx}
                      className="card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow animate-slideIn"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {card.image && (
                        <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                      )}
                      <div className="p-4">
                        <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                        <p className="text-gray-600 mb-4">{card.description}</p>
                        {card.link && (
                          <a href={card.link} className="text-blue-600 hover:underline">
                            En savoir plus →
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
            
            await new Promise(resolve => setTimeout(resolve, 150));
          }
          
          // Version finale
          return (
            <div className="cards-container p-6 animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">{title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, i) => (
                  <div
                    key={i}
                    className="card bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {card.image && (
                      <img src={card.image} alt={card.title} className="w-full h-48 object-cover" />
                    )}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                      <p className="text-gray-600 mb-4">{card.description}</p>
                      {card.link && (
                        <a href={card.link} className="text-blue-600 hover:underline">
                          En savoir plus →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        },
      },
      
      // Génération de tableau de bord
      generateDashboard: {
        description: 'Générer un tableau de bord avec KPIs',
        parameters: z.object({
          title: z.string(),
          kpis: z.array(z.object({
            label: z.string(),
            value: z.string(),
            change: z.string().optional(),
            trend: z.enum(['up', 'down', 'neutral']).optional(),
          })),
        }),
        generate: async function* ({ title, kpis }) {
          // Skeleton
          yield (
            <div className="dashboard p-6">
              <h2 className="text-2xl font-bold mb-6 animate-fadeIn">{title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((_, i) => (
                  <div key={i} className="animate-pulse bg-white p-6 rounded-lg shadow">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          );
          
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Version finale
          return (
            <div className="dashboard p-6 animate-fadeIn">
              <h2 className="text-2xl font-bold mb-6">{title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {kpis.map((kpi, i) => (
                  <div
                    key={i}
                    className="kpi-card bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow animate-slideIn"
                    style={{ animationDelay: `${i * 100}ms` }}
                  >
                    <div className="text-sm text-gray-600 mb-2">{kpi.label}</div>
                    <div className="text-3xl font-bold text-gray-900 mb-2">{kpi.value}</div>
                    {kpi.change && (
                      <div className={`text-sm ${
                        kpi.trend === 'up' ? 'text-green-600' :
                        kpi.trend === 'down' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {kpi.trend === 'up' && '↑ '}
                        {kpi.trend === 'down' && '↓ '}
                        {kpi.change}
                      </div>
                    )}
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
