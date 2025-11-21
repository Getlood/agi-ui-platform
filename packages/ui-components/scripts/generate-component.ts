/**
 * Générateur de composants Web Components
 * Utilise un template pour créer rapidement de nouveaux composants
 */

interface ComponentConfig {
  name: string;
  category: 'atom' | 'molecule' | 'organism' | 'template';
  props: Array<{
    name: string;
    type: string;
    default?: any;
    description: string;
  }>;
  events?: string[];
  slots?: string[];
}

const components: ComponentConfig[] = [
  // Form Components
  {
    name: 'Checkbox',
    category: 'atom',
    props: [
      { name: 'label', type: 'string', default: '', description: 'Label du checkbox' },
      { name: 'checked', type: 'boolean', default: false, description: 'État coché' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Désactivé' },
      { name: 'indeterminate', type: 'boolean', default: false, description: 'État indéterminé' },
    ],
    events: ['change'],
  },
  {
    name: 'Radio',
    category: 'atom',
    props: [
      { name: 'label', type: 'string', default: '', description: 'Label du radio' },
      { name: 'value', type: 'string', default: '', description: 'Valeur' },
      { name: 'checked', type: 'boolean', default: false, description: 'État coché' },
      { name: 'name', type: 'string', default: '', description: 'Nom du groupe' },
    ],
    events: ['change'],
  },
  {
    name: 'Switch',
    category: 'atom',
    props: [
      { name: 'label', type: 'string', default: '', description: 'Label du switch' },
      { name: 'checked', type: 'boolean', default: false, description: 'État activé' },
      { name: 'disabled', type: 'boolean', default: false, description: 'Désactivé' },
    ],
    events: ['change'],
  },
  {
    name: 'Select',
    category: 'atom',
    props: [
      { name: 'label', type: 'string', default: '', description: 'Label du select' },
      { name: 'placeholder', type: 'string', default: 'Sélectionner...', description: 'Placeholder' },
      { name: 'options', type: 'array', default: [], description: 'Options' },
      { name: 'value', type: 'string', default: '', description: 'Valeur sélectionnée' },
    ],
    events: ['change'],
  },
  {
    name: 'Textarea',
    category: 'atom',
    props: [
      { name: 'label', type: 'string', default: '', description: 'Label' },
      { name: 'placeholder', type: 'string', default: '', description: 'Placeholder' },
      { name: 'rows', type: 'number', default: 4, description: 'Nombre de lignes' },
      { name: 'maxLength', type: 'number', description: 'Longueur maximale' },
    ],
    events: ['input', 'change'],
  },
  {
    name: 'Slider',
    category: 'atom',
    props: [
      { name: 'label', type: 'string', default: '', description: 'Label' },
      { name: 'min', type: 'number', default: 0, description: 'Valeur minimale' },
      { name: 'max', type: 'number', default: 100, description: 'Valeur maximale' },
      { name: 'step', type: 'number', default: 1, description: 'Pas' },
      { name: 'value', type: 'number', default: 50, description: 'Valeur' },
    ],
    events: ['change'],
  },
  
  // Feedback Components
  {
    name: 'Alert',
    category: 'atom',
    props: [
      { name: 'variant', type: 'string', default: 'info', description: 'Variant (info, success, warning, error)' },
      { name: 'title', type: 'string', default: '', description: 'Titre' },
      { name: 'closable', type: 'boolean', default: false, description: 'Peut être fermé' },
    ],
    slots: ['default'],
    events: ['close'],
  },
  {
    name: 'Toast',
    category: 'atom',
    props: [
      { name: 'variant', type: 'string', default: 'info', description: 'Variant' },
      { name: 'message', type: 'string', default: '', description: 'Message' },
      { name: 'duration', type: 'number', default: 3000, description: 'Durée (ms)' },
    ],
    events: ['close'],
  },
  {
    name: 'Progress',
    category: 'atom',
    props: [
      { name: 'value', type: 'number', default: 0, description: 'Valeur (0-100)' },
      { name: 'variant', type: 'string', default: 'primary', description: 'Variant' },
      { name: 'showLabel', type: 'boolean', default: true, description: 'Afficher le label' },
    ],
  },
  {
    name: 'Skeleton',
    category: 'atom',
    props: [
      { name: 'variant', type: 'string', default: 'text', description: 'Variant (text, circle, rect)' },
      { name: 'width', type: 'string', default: '100%', description: 'Largeur' },
      { name: 'height', type: 'string', default: '20px', description: 'Hauteur' },
    ],
  },
  
  // Display Components
  {
    name: 'Avatar',
    category: 'atom',
    props: [
      { name: 'src', type: 'string', default: '', description: 'URL de l\'image' },
      { name: 'alt', type: 'string', default: '', description: 'Texte alternatif' },
      { name: 'size', type: 'string', default: 'medium', description: 'Taille (small, medium, large)' },
      { name: 'fallback', type: 'string', default: '', description: 'Initiales de fallback' },
    ],
  },
  {
    name: 'Chip',
    category: 'atom',
    props: [
      { name: 'label', type: 'string', default: '', description: 'Label' },
      { name: 'variant', type: 'string', default: 'default', description: 'Variant' },
      { name: 'deletable', type: 'boolean', default: false, description: 'Peut être supprimé' },
    ],
    events: ['delete'],
  },
  {
    name: 'Divider',
    category: 'atom',
    props: [
      { name: 'orientation', type: 'string', default: 'horizontal', description: 'Orientation' },
      { name: 'variant', type: 'string', default: 'solid', description: 'Variant (solid, dashed)' },
    ],
  },
  {
    name: 'Icon',
    category: 'atom',
    props: [
      { name: 'name', type: 'string', default: '', description: 'Nom de l\'icône' },
      { name: 'size', type: 'string', default: 'medium', description: 'Taille' },
      { name: 'color', type: 'string', default: 'currentColor', description: 'Couleur' },
    ],
  },
  {
    name: 'Tooltip',
    category: 'atom',
    props: [
      { name: 'content', type: 'string', default: '', description: 'Contenu du tooltip' },
      { name: 'placement', type: 'string', default: 'top', description: 'Position' },
    ],
    slots: ['default'],
  },
];

function generateComponentCode(config: ComponentConfig): string {
  const { name, category, props, events = [], slots = [] } = config;
  const tagName = `agi-${name.toLowerCase()}`;
  
  return `/**
 * ${name} Component
 * ${config.props.map(p => p.description).join(', ')}
 */

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('${tagName}')
export class Agi${name} extends LitElement {
  static styles = css\`
    :host {
      display: inline-block;
    }
    
    /* Add your styles here */
  \`;

${props.map(prop => `  @property({ type: ${prop.type === 'boolean' ? 'Boolean' : prop.type === 'number' ? 'Number' : 'String'}${prop.default !== undefined ? `, reflect: true` : ''} })
  ${prop.name}${prop.default !== undefined ? ` = ${JSON.stringify(prop.default)}` : ''};
`).join('\n')}

  render() {
    return html\`
      <div class="${tagName}">
        <!-- Component content -->
        <slot></slot>
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    '${tagName}': Agi${name};
  }
}

// Metadata for VLA
export const ${name}Metadata = {
  tag: '${tagName}',
  category: '${category}',
  description: '${config.props[0]?.description || name}',
  props: ${JSON.stringify(props, null, 2)},
  events: ${JSON.stringify(events)},
  slots: ${JSON.stringify(slots)},
};
`;
}

// Générer tous les composants
components.forEach(config => {
  const code = generateComponentCode(config);
  const category = config.category === 'atom' ? 'atoms' : config.category + 's';
  const subcategory = config.name.match(/Checkbox|Radio|Switch|Select|Textarea|Slider/) ? 'form' :
                      config.name.match(/Alert|Toast|Progress|Skeleton/) ? 'feedback' :
                      config.name.match(/Avatar|Chip|Divider|Icon|Tooltip/) ? 'display' : '';
  
  const path = subcategory 
    ? `src/${category}/${subcategory}/${config.name}.ts`
    : `src/${category}/${config.name}.ts`;
  
  console.log(`Generated: ${path}`);
  // Dans un vrai script, on écrirait le fichier ici
});

export { components, generateComponentCode };
