/**
 * @agi-ui/components
 * 
 * Bibliothèque de composants atomiques Web Components
 * pour la plateforme AGI-UI
 */

// Atoms
export { AgiButton } from './atoms/Button.js';
export { AgiInput } from './atoms/Input.js';
export { AgiBadge } from './atoms/Badge.js';
export { AgiSpinner } from './atoms/Spinner.js';

// Molecules
export { AgiCard } from './molecules/Card.js';

// Organisms
export { AgiDataTable } from './organisms/DataTable.js';
export { AgiModal } from './organisms/Modal.js';
export { AgiSidebar } from './organisms/Sidebar.js';

// Metadata pour le VLA
export const COMPONENT_METADATA = {
  'agi-button': {
    name: 'Button',
    type: 'atom',
    description: 'Bouton interactif avec variantes de style',
    props: {
      label: { type: 'string', required: true },
      variant: {
        type: 'enum',
        values: ['primary', 'secondary', 'danger', 'ghost'],
        default: 'primary',
      },
      size: {
        type: 'enum',
        values: ['small', 'medium', 'large'],
        default: 'medium',
      },
      disabled: { type: 'boolean', default: false },
      loading: { type: 'boolean', default: false },
      icon: { type: 'string', required: false },
    },
    useCases: ['Soumettre un formulaire', 'Déclencher une action', 'Navigation'],
    semanticTags: ['action', 'interactive', 'clickable'],
  },
  'agi-input': {
    name: 'Input',
    type: 'atom',
    description: 'Champ de saisie avec label et validation',
    props: {
      label: { type: 'string', required: false },
      type: {
        type: 'enum',
        values: ['text', 'email', 'password', 'number', 'tel', 'url'],
        default: 'text',
      },
      placeholder: { type: 'string', required: false },
      value: { type: 'string', default: '' },
      required: { type: 'boolean', default: false },
      disabled: { type: 'boolean', default: false },
      error: { type: 'string', required: false },
      helperText: { type: 'string', required: false },
    },
    useCases: ['Saisie de texte', 'Formulaire', 'Recherche'],
    semanticTags: ['input', 'form', 'data-entry'],
  },
  'agi-card': {
    name: 'Card',
    type: 'molecule',
    description: 'Conteneur de contenu avec en-tête et pied de page optionnels',
    props: {
      variant: {
        type: 'enum',
        values: ['default', 'bordered', 'elevated', 'flat'],
        default: 'default',
      },
      hoverable: { type: 'boolean', default: false },
      clickable: { type: 'boolean', default: false },
    },
    slots: {
      default: 'Contenu principal',
      header: 'En-tête de la carte',
      footer: 'Pied de page de la carte',
    },
    useCases: ['Afficher du contenu', 'Grouper des éléments', 'Liste d\'items'],
    semanticTags: ['container', 'content', 'layout'],
  },
};

// Helper pour récupérer les métadonnées
export function getComponentMetadata(tagName: string) {
  return COMPONENT_METADATA[tagName as keyof typeof COMPONENT_METADATA];
}

// Helper pour lister tous les composants
export function getAllComponents() {
  return Object.keys(COMPONENT_METADATA);
}

// Version
export const VERSION = '2.0.0';
