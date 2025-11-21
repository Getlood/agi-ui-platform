import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @component agi-tag
 * @description Un composant Tag coloré et optionnellement fermable.
 * @category display
 * @prop {string} color - La couleur du tag (ex: 'primary', 'success', 'warning', 'danger').
 * @prop {boolean} closable - Indique si le tag peut être fermé.
 * @prop {boolean} closed - État interne pour gérer la fermeture du tag.
 * @event {CustomEvent} close - Déclenché lorsque l'utilisateur clique sur le bouton de fermeture.
 */
@customElement('agi-tag')
export class AgiTag extends LitElement {
  /**
   * La couleur du tag.
   * Les valeurs supportées sont 'primary', 'success', 'warning', 'danger'.
   */
  @property({ type: String })
  color: 'primary' | 'success' | 'warning' | 'danger' = 'primary';

  /**
   * Indique si le tag peut être fermé.
   */
  @property({ type: Boolean })
  closable: boolean = false;

  /**
   * État interne pour gérer si le tag est fermé.
   * Il est préférable de le laisser comme état interne pour la démo,
   * mais dans un cas réel, il pourrait être une propriété pour un contrôle externe.
   */
  @state()
  private closed: boolean = false;

  static styles = css\`
    :host {
      display: inline-block;
      --tag-bg-color: #007bff; /* Default primary */
      --tag-text-color: white;
      --tag-border-radius: 4px;
      --tag-padding: 0.25em 0.75em;
      --tag-font-size: 0.875rem;
      --tag-close-color: rgba(255, 255, 255, 0.7);
    }

    /* Couleurs de base */
    :host([color="primary"]) {
      --tag-bg-color: #007bff;
    }
    :host([color="success"]) {
      --tag-bg-color: #28a745;
    }
    :host([color="warning"]) {
      --tag-bg-color: #ffc107;
      --tag-text-color: #212529; /* Texte sombre pour fond clair */
      --tag-close-color: rgba(0, 0, 0, 0.5);
    }
    :host([color="danger"]) {
      --tag-bg-color: #dc3545;
    }

    .tag {
      display: flex;
      align-items: center;
      background-color: var(--tag-bg-color);
      color: var(--tag-text-color);
      border-radius: var(--tag-border-radius);
      padding: var(--tag-padding);
      font-size: var(--tag-font-size);
      line-height: 1;
      transition: opacity 0.3s ease;
    }

    :host([closed]) .tag {
      display: none;
    }

    .close-button {
      margin-left: 0.5em;
      cursor: pointer;
      background: none;
      border: none;
      color: var(--tag-close-color);
      padding: 0;
      font-size: 1.2em;
      line-height: 1;
      opacity: 0.8;
      transition: opacity 0.2s ease;
    }

    .close-button:hover {
      opacity: 1;
    }
  \`;

  private handleClose() {
    this.closed = true;
    this.dispatchEvent(new CustomEvent('close', {
      detail: { color: this.color },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    if (this.closed) {
      return html\`\`;
    }

    return html\`
      <div class="tag">
        <slot></slot>
        ${this.closable
          ? html\`
              <button class="close-button" @click=\${this.handleClose} aria-label="Fermer">
                &times;
              </button>
            \`
          : ''}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-tag': AgiTag;
  }
}
