import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @typedef {'info' | 'success' | 'warning' | 'error'} AlertVariant
 */

/**
 * Composant Web Component pour afficher un message d'alerte.
 *
 * @tag agi-alert
 * @category feedback
 *
 * @property {AlertVariant} variant - Le style de l'alerte (info, success, warning, error).
 * @property {boolean} closable - Indique si l'alerte peut être fermée.
 * @property {boolean} open - État d'ouverture/fermeture de l'alerte.
 *
 * @slot - Contenu principal du message d'alerte.
 * @slot icon - Icône personnalisée à afficher à gauche du message.
 * @slot close-button - Bouton de fermeture personnalisé.
 */
@customElement('agi-alert')
export class AgiAlert extends LitElement {
  static styles = css\`
    :host {
      display: block;
      margin-bottom: 1rem;
    }

    .alert {
      display: flex;
      align-items: center;
      padding: 1rem;
      border-radius: 0.25rem;
      border: 1px solid transparent;
      color: #000; /* Default text color */
      transition: opacity 0.3s ease-in-out;
    }

    :host([hidden]) .alert {
      display: none;
    }

    .alert--info {
      background-color: #d1ecf1;
      border-color: #bee5eb;
      color: #0c5460;
    }

    .alert--success {
      background-color: #d4edda;
      border-color: #c3e6cb;
      color: #155724;
    }

    .alert--warning {
      background-color: #fff3cd;
      border-color: #ffeeba;
      color: #856404;
    }

    .alert--error {
      background-color: #f8d7da;
      border-color: #f5c6cb;
      color: #721c24;
    }

    .alert__content {
      flex-grow: 1;
    }

    .alert__icon {
      margin-right: 0.75rem;
      /* Basic icon styling - replace with actual icon implementation */
      font-size: 1.25rem;
      line-height: 1;
    }

    .alert__close {
      margin-left: 1rem;
      cursor: pointer;
      background: none;
      border: none;
      font-size: 1.5rem;
      line-height: 1;
      padding: 0;
      color: inherit;
      opacity: 0.5;
      transition: opacity 0.15s ease-in-out;
    }

    .alert__close:hover {
      opacity: 0.75;
    }
  \`;

  /**
   * Le style de l'alerte (info, success, warning, error).
   * @type {AlertVariant}
   */
  @property({ type: String, reflect: true })
  variant: 'info' | 'success' | 'warning' | 'error' = 'info';

  /**
   * Indique si l'alerte peut être fermée.
   */
  @property({ type: Boolean })
  closable = false;

  /**
   * État d'ouverture/fermeture de l'alerte.
   * Utilise l'attribut 'hidden' pour masquer le composant.
   */
  @property({ type: Boolean, reflect: true })
  open = true;

  private _handleClose() {
    this.open = false;
    /**
     * Événement émis lorsque l'alerte est fermée.
     * @event agi-alert-close
     */
    this.dispatchEvent(new CustomEvent('agi-alert-close', { bubbles: true, composed: true }));
  }

  render() {
    const alertClass = \`alert alert--\${this.variant}\`;

    // Utilisation de l'attribut 'hidden' pour masquer le composant lorsque 'open' est false
    this.hidden = !this.open;

    return html\`
      <div class=\${alertClass} role="alert">
        <div class="alert__icon">
          <slot name="icon">
            \${this.renderDefaultIcon()}
          </slot>
        </div>
        <div class="alert__content">
          <slot></slot>
        </div>
        \${this.closable
          ? html\`
              <slot name="close-button">
                <button class="alert__close" @click=\${this._handleClose} aria-label="Fermer">
                  &times;
                </button>
              </slot>
            \`
          : ''}
      </div>
    \`;
  }

  /**
   * Rendu d'une icône par défaut basée sur la variante.
   * En production, ceci serait remplacé par un système d'icônes plus robuste (SVG, etc.).
   */
  private renderDefaultIcon() {
    switch (this.variant) {
      case 'success':
        return html\`\u2713\`; // Checkmark
      case 'warning':
        return html\`!\`; // Exclamation
      case 'error':
        return html\`\u2716\`; // X
      case 'info':
      default:
        return html\`i\`; // 'i' for info
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-alert': AgiAlert;
  }
}

// Métadonnées VLA (Vue-Lit-Agnostic) - Ceci est un exemple de documentation JSDoc
// qui peut être parsée par des outils de génération de métadonnées.
// Pour un support VLA spécifique, un fichier de métadonnées séparé (ex: agi-alert.vla.json)
// ou un format JSDoc spécifique pourrait être requis.
// Les informations clés sont déjà présentes dans le JSDoc de la classe et des propriétés.
// Exemple de structure de métadonnées VLA si nécessaire:
/*
{
  "tag": "agi-alert",
  "name": "Alert",
  "category": "feedback",
  "description": "Affiche un message d'alerte contextuel.",
  "props": [
    { "name": "variant", "type": "string", "default": "info", "values": ["info", "success", "warning", "error"] },
    { "name": "closable", "type": "boolean", "default": "false" },
    { "name": "open", "type": "boolean", "default": "true" }
  ],
  "slots": [
    { "name": "", "description": "Contenu principal de l'alerte." },
    { "name": "icon", "description": "Icône personnalisée." },
    { "name": "close-button", "description": "Bouton de fermeture personnalisé." }
  ],
  "events": [
    { "name": "agi-alert-close", "description": "Émis lorsque l'alerte est fermée." }
  ]
}
*/
