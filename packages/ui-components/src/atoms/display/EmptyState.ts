import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Composant d'état vide (Empty State) avec une icône et un message.
 * Utilisé pour informer l'utilisateur qu'il n'y a pas de contenu à afficher.
 *
 * @tag agi-empty-state
 * @category display
 * @property {string} message - Le message principal à afficher.
 * @property {string} iconName - Le nom de l'icône à afficher (simulé ici par un caractère).
 */
@customElement('agi-empty-state')
export class EmptyState extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 20px;
      text-align: center;
      border: 1px dashed var(--empty-state-border-color, #ccc);
      border-radius: 8px;
      color: var(--empty-state-text-color, #666);
      font-family: sans-serif;
    }

    .icon {
      font-size: 48px;
      margin-bottom: 10px;
      color: var(--empty-state-icon-color, #999);
    }

    .message {
      font-size: 16px;
      font-weight: 500;
    }

    .details {
      margin-top: 10px;
      font-size: 14px;
      color: var(--empty-state-details-color, #999);
    }
  `;

  @property({ type: String })
  message: string = "Aucune donnée disponible pour le moment.";

  @property({ type: String, attribute: 'icon-name' })
  iconName: string = "🚫"; // Utilisation d'un emoji comme icône de substitution

  /**
   * Slot pour des détails ou des actions supplémentaires.
   */
  @property({ type: String })
  details: string = "";

  render() {
    return html`
      <div class="icon" role="img" aria-label="Icône d'état vide">${this.iconName}</div>
      <p class="message">${this.message}</p>
      ${this.details ? html`<p class="details">${this.details}</p>` : ''}
      <slot></slot>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-empty-state': EmptyState;
  }
}
