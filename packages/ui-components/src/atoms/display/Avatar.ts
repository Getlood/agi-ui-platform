import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @component agi-chip-deletable
 * @description Un composant d'étiquette (chip) avec une option de suppression.
 * @category display
 * @tag agi-chip-deletable
 * @props_count 3
 *
 * @property {string} label - Le texte principal de l'étiquette.
 * @property {boolean} deletable - Indique si l'icône de suppression doit être affichée.
 * @property {string} deleteIcon - Le caractère ou le nom de l'icône à utiliser pour la suppression (par défaut: '×').
 *
 * @event {CustomEvent} delete - Déclenché lorsque l'utilisateur clique sur l'icône de suppression.
 */
@customElement('agi-chip-deletable')
export class AgiChipDeletable extends LitElement {
  static styles = css\`
    :host {
      display: inline-block;
    }
    .chip {
      display: flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 16px;
      background-color: #e0e0e0; /* Couleur de fond par défaut */
      color: #333; /* Couleur du texte par défaut */
      font-family: sans-serif;
      font-size: 14px;
      line-height: 1;
      user-select: none;
      transition: background-color 0.2s;
    }
    .chip:hover {
      background-color: #d0d0d0;
    }
    .label {
      margin-right: 4px;
    }
    .delete-button {
      cursor: pointer;
      margin-left: 4px;
      font-weight: bold;
      font-size: 16px;
      line-height: 1;
      padding: 0 2px;
      border: none;
      background: none;
      color: inherit;
      opacity: 0.7;
      transition: opacity 0.2s;
    }
    .delete-button:hover {
      opacity: 1;
      color: #c00; /* Couleur de survol pour l'icône de suppression */
    }
  \`;

  @property({ type: String })
  label: string = 'Chip Label';

  @property({ type: Boolean })
  deletable: boolean = false;

  @property({ type: String })
  deleteIcon: string = '×'; // Caractère 'multiplication' comme icône de suppression

  private _handleDelete() {
    /**
     * Déclenché lorsque l'utilisateur clique sur l'icône de suppression.
     * @type {CustomEvent}
     */
    this.dispatchEvent(new CustomEvent('delete', {
      bubbles: true,
      composed: true,
      detail: { label: this.label }
    }));
  }

  render() {
    return html\`
      <div class="chip">
        <span class="label">\${this.label}</span>
        \${this.deletable
          ? html\`
              <button
                class="delete-button"
                @click=\${this._handleDelete}
                aria-label="Supprimer l'étiquette \${this.label}"
              >
                \${this.deleteIcon}
              </button>
            \`
          : ''}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-chip-deletable': AgiChipDeletable;
  }
}
