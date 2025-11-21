import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Composant Web Component Textarea (Zone de texte)
 *
 * @slot - Contenu par défaut de la zone de texte.
 * @csspart textarea - Le textarea natif.
 */
@customElement('agi-textarea')
export class AgiTextarea extends LitElement {
  static styles = css\`
    :host {
      display: block;
      font-family: sans-serif;
    }

    .textarea-container {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    textarea {
      padding: 8px 12px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      line-height: 1.5;
      resize: vertical; /* Permet uniquement le redimensionnement vertical */
      transition: border-color 0.2s ease-in-out;
    }

    textarea:focus {
      outline: none;
      border-color: #007bff; /* Couleur de focus */
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }

    .char-count {
      align-self: flex-end;
      font-size: 12px;
      color: #6c757d;
      margin-top: 4px;
    }

    .char-count.limit-reached {
      color: #dc3545; /* Rouge si la limite est atteinte */
      font-weight: bold;
    }
  \`;

  /**
   * Le nombre de lignes visibles dans la zone de texte.
   */
  @property({ type: Number })
  rows = 4;

  /**
   * Le nombre maximum de caractères que l'utilisateur peut entrer.
   */
  @property({ type: Number, attribute: 'max-length' })
  maxLength?: number;

  /**
   * La valeur actuelle de la zone de texte.
   */
  @property({ type: String })
  value = '';

  /**
   * Le texte de l'espace réservé (placeholder).
   */
  @property({ type: String })
  placeholder = '';

  private _handleInput(event: Event) {
    const textarea = event.target as HTMLTextAreaElement;
    this.value = textarea.value;

    /**
     * Événement émis lorsque la valeur de la zone de texte change.
     * @event change
     * @type {object}
     * @property {string} value - La nouvelle valeur de la zone de texte.
     */
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    const charCount = this.value.length;
    const limitReached = this.maxLength !== undefined && charCount > this.maxLength;

    return html\`
      <div class="textarea-container">
        <textarea
          part="textarea"
          .rows=${this.rows}
          .maxLength=${this.maxLength ?? -1}
          .value=${this.value}
          .placeholder=${this.placeholder}
          @input=${this._handleInput}
          aria-multiline="true"
        ></textarea>
        ${this.maxLength !== undefined
          ? html\`
              <span class="char-count \${limitReached ? 'limit-reached' : ''}">
                ${charCount}${this.maxLength ? \` / \${this.maxLength}\` : ''}
              </span>
            \`
          : ''}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-textarea': AgiTextarea;
  }
}
