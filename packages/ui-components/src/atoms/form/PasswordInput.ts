import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @component agi-password-input
 * @description Champ de saisie de mot de passe avec un bouton pour afficher/masquer le mot de passe.
 * @category form
 * @prop {string} value - La valeur actuelle du champ de saisie.
 * @prop {string} label - Le libellé du champ de saisie.
 * @prop {string} placeholder - Le texte d'espace réservé.
 * @prop {boolean} disabled - Indique si le champ est désactivé.
 * @prop {boolean} required - Indique si le champ est requis.
 * @prop {boolean} showToggle - Indique si le bouton d'affichage/masquage doit être visible.
 * @fires input - Événement natif 'input' émis lors de la saisie.
 * @fires change - Événement natif 'change' émis lorsque la valeur change et que le champ perd le focus.
 */
@customElement('agi-password-input')
export class AgiPasswordInput extends LitElement {
  // @ts-ignore: Ignorer les erreurs de compilation pour les templates Lit
  static styles = css\`
    :host {
      display: block;
      margin-bottom: 16px;
      font-family: sans-serif;
    }

    .input-container {
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 4px;
      transition: border-color 0.2s ease-in-out;
    }

    .input-container:focus-within {
      border-color: #007bff; /* Couleur de focus */
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    label {
      display: block;
      margin-bottom: 4px;
      font-weight: bold;
      color: #333;
    }

    input {
      flex-grow: 1;
      border: none;
      padding: 8px;
      font-size: 16px;
      outline: none;
      background: transparent;
    }

    button {
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #666;
      transition: color 0.2s ease-in-out;
    }

    button:hover {
      color: #000;
    }

    button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    /* Styles pour l'état désactivé */
    :host([disabled]) .input-container {
      background-color: #f5f5f5;
      cursor: not-allowed;
    }

    :host([disabled]) input {
      color: #a0a0a0;
      cursor: not-allowed;
    }

    /* Icônes (simulées avec du texte pour la simplicité) */
    .icon {
      font-size: 18px;
      line-height: 1;
    }
  \`;

  @property({ type: String })
  value: string = '';

  @property({ type: String })
  label: string = 'Mot de passe';

  @property({ type: String })
  placeholder: string = 'Entrez votre mot de passe';

  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  @property({ type: Boolean })
  required: boolean = false;

  @property({ type: Boolean })
  showToggle: boolean = true;

  @state()
  private _passwordVisible: boolean = false;

  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = input.value;
    // Dispatch un événement 'input' natif pour la compatibilité
    this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private _handleChange(event: Event) {
    // Dispatch un événement 'change' natif pour la compatibilité
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true, composed: true }));
  }

  private _togglePasswordVisibility() {
    if (!this.disabled) {
      this._passwordVisible = !this._passwordVisible;
    }
  }

  // @ts-ignore: Ignorer les erreurs de compilation pour les templates Lit
  render() {
    const inputType = this._passwordVisible ? 'text' : 'password';
    // Utilisation d'icônes simples pour la démonstration, idéalement des icônes SVG ou une police d'icônes
    const toggleIcon = this._passwordVisible ? '👁️' : '🔒'; 

    return html\`
      <label for="password-input">${this.label}${this.required ? ' *' : ''}</label>
      <div class="input-container">
        <input
          id="password-input"
          .type="${inputType}"
          .value="${this.value}"
          .placeholder="${this.placeholder}"
          ?disabled="${this.disabled}"
          ?required="${this.required}"
          @input="${this._handleInput}"
          @change="${this._handleChange}"
        />
        ${this.showToggle
          ? html\`
              <button
                @click="${this._togglePasswordVisibility}"
                ?disabled="${this.disabled}"
                aria-label="${this._passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}"
                title="${this._passwordVisible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}"
              >
                <span class="icon">${toggleIcon}</span>
              </button>
            \`
          : ''}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-password-input': AgiPasswordInput;
  }
}
