import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @tag agi-color-picker
 * @summary Un sélecteur de couleur avancé basé sur Lit Element.
 * @category form
 *
 * @property {string} color - La couleur actuellement sélectionnée (format hexadécimal).
 * @property {boolean} disabled - Désactive le sélecteur de couleur.
 * @fires {CustomEvent<string>} color-change - Événement émis lorsque la couleur est modifiée.
 */
@customElement('agi-color-picker')
export class AgiColorPicker extends LitElement {
  /**
   * La couleur actuellement sélectionnée (format hexadécimal).
   */
  @property({ type: String })
  color: string = '#000000';

  /**
   * Désactive le sélecteur de couleur.
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * État interne pour la valeur du champ de texte.
   */
  @state()
  private _inputValue: string = this.color;

  static styles = css`
    :host {
      display: inline-block;
      --agi-color-picker-size: 40px;
      --agi-color-picker-border-color: #ccc;
      --agi-color-picker-disabled-opacity: 0.6;
    }

    .color-picker-container {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 4px;
      border: 1px solid var(--agi-color-picker-border-color);
      border-radius: 4px;
      transition: border-color 0.2s;
    }

    :host([disabled]) .color-picker-container {
      opacity: var(--agi-color-picker-disabled-opacity);
      pointer-events: none;
    }

    .color-input {
      width: var(--agi-color-picker-size);
      height: var(--agi-color-picker-size);
      padding: 0;
      border: none;
      cursor: pointer;
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      background: transparent;
    }

    .color-input::-webkit-color-swatch-wrapper {
      padding: 0;
    }

    .color-input::-webkit-color-swatch {
      border: 1px solid var(--agi-color-picker-border-color);
      border-radius: 4px;
    }

    .color-input::-moz-color-swatch {
      border: 1px solid var(--agi-color-picker-border-color);
      border-radius: 4px;
    }

    .hex-input {
      flex-grow: 1;
      padding: 8px;
      border: 1px solid var(--agi-color-picker-border-color);
      border-radius: 4px;
      font-family: inherit;
      font-size: 14px;
      text-transform: uppercase;
      min-width: 80px;
    }

    .hex-input:focus {
      outline: none;
      border-color: #007bff; /* Couleur de focus */
    }
  `;

  willUpdate(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('color') && this.color !== this._inputValue) {
      // Met à jour l'état interne si la propriété externe 'color' change
      this._inputValue = this.color;
    }
  }

  private _handleColorChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const newColor = target.value.toUpperCase();
    this.color = newColor;
    this._inputValue = newColor;
    this._dispatchColorChange(newColor);
  }

  private _handleInputChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this._inputValue = target.value.toUpperCase();
  }

  private _handleInputBlur() {
    // Valide et met à jour la couleur lorsque l'utilisateur quitte le champ de texte
    const hexRegex = /^#([0-9A-F]{3}){1,2}$/i;
    let newColor = this._inputValue.trim().toUpperCase();

    if (!hexRegex.test(newColor)) {
      // Si la valeur n'est pas un hex valide, on revient à la couleur actuelle
      newColor = this.color;
    }

    this.color = newColor;
    this._inputValue = newColor;
    this._dispatchColorChange(newColor);
  }

  private _dispatchColorChange(newColor: string) {
    this.dispatchEvent(
      new CustomEvent('color-change', {
        detail: newColor,
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="color-picker-container" ?disabled=${this.disabled}>
        <input
          type="color"
          class="color-input"
          .value=${this.color}
          @input=${this._handleColorChange}
          ?disabled=${this.disabled}
          aria-label="Sélecteur de couleur"
        />
        <input
          type="text"
          class="hex-input"
          .value=${this._inputValue}
          @input=${this._handleInputChange}
          @blur=${this._handleInputBlur}
          @keydown=${(e: KeyboardEvent) => {
            if (e.key === 'Enter') {
              this._handleInputBlur();
            }
          }}
          maxlength="7"
          placeholder="#RRGGBB"
          ?disabled=${this.disabled}
          aria-label="Code couleur hexadécimal"
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-color-picker': AgiColorPicker;
  }
}
