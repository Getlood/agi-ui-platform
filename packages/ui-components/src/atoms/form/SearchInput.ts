import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @typedef {Object} SearchEventDetail
 * @property {string} value - La valeur actuelle du champ de recherche.
 */

/**
 * Composant Web Component pour un champ de recherche avec fonctionnalité de debounce.
 * Il émet un événement 'search' après une période d'inactivité de l'utilisateur.
 *
 * @tag agi-search-input
 * @category form
 * @fires {CustomEvent<SearchEventDetail>} search - Émis lorsque la valeur de recherche est debounced.
 */
@customElement('agi-search-input')
export class AgiSearchInput extends LitElement {
  /**
   * La valeur actuelle du champ de recherche.
   */
  @property({ type: String })
  value: string = '';

  /**
   * Le texte de l'espace réservé (placeholder) pour le champ de recherche.
   */
  @property({ type: String })
  placeholder: string = 'Rechercher...';

  /**
   * Le délai en millisecondes pour le debounce.
   */
  @property({ type: Number })
  debounce: number = 300;

  /**
   * L'identifiant du timer pour le debounce.
   */
  @state()
  private _debounceTimer: number | undefined;

  static override styles = css`
    :host {
      display: inline-block;
      font-family: sans-serif;
    }

    .search-container {
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px 8px;
      transition: border-color 0.2s ease-in-out;
    }

    .search-container:focus-within {
      border-color: #007bff; /* Couleur de focus */
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    input[type="search"] {
      flex-grow: 1;
      border: none;
      outline: none;
      padding: 4px 0;
      font-size: 16px;
      line-height: 1.5;
      width: 100%;
    }

    /* Style pour le bouton de réinitialisation (optionnel) */
    .clear-button {
      background: none;
      border: none;
      color: #999;
      cursor: pointer;
      margin-left: 8px;
      padding: 0;
      font-size: 16px;
      line-height: 1;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .clear-button:hover {
      opacity: 1;
      color: #333;
    }
  `;

  /**
   * Gère l'événement d'entrée (input) du champ de texte.
   * @param event L'événement d'entrée.
   */
  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;

    // Annule le timer précédent
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }

    // Démarre un nouveau timer
    this._debounceTimer = window.setTimeout(() => {
      this._dispatchSearchEvent();
    }, this.debounce);
  }

  /**
   * Réinitialise la valeur du champ de recherche et déclenche un événement de recherche.
   */
  private _clearSearch() {
    this.value = '';
    // Annule le timer en cours pour éviter un événement de recherche non désiré
    if (this._debounceTimer) {
      clearTimeout(this._debounceTimer);
    }
    this._dispatchSearchEvent();
  }

  /**
   * Déclenche l'événement 'search' avec la valeur actuelle.
   */
  private _dispatchSearchEvent() {
    this.dispatchEvent(
      new CustomEvent('search', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      })
    );
  }

  override render() {
    return html`
      <div class="search-container">
        <input
          type="search"
          .value=${this.value}
          .placeholder=${this.placeholder}
          @input=${this._handleInput}
          aria-label="Champ de recherche"
        />
        ${this.value
          ? html`<button
              class="clear-button"
              @click=${this._clearSearch}
              aria-label="Effacer la recherche"
            >
              &times;
            </button>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-search-input': AgiSearchInput;
  }
}
