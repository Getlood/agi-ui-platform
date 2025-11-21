import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

/**
 * Composant Web Component pour un champ numérique avec des limites min et max.
 * @tag agi-number-input
 */
@customElement('agi-number-input')
export class AgiNumberInput extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      font-family: sans-serif;
    }
    .container {
      display: flex;
      align-items: center;
      border: 1px solid #ccc;
      border-radius: 4px;
      overflow: hidden;
      transition: border-color 0.2s;
    }
    .container:focus-within {
      border-color: #007bff; /* Couleur de focus */
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }
    input[type="number"] {
      flex-grow: 1;
      padding: 8px 12px;
      border: none;
      outline: none;
      font-size: 16px;
      text-align: center;
      -moz-appearance: textfield; /* Masquer les flèches par défaut dans Firefox */
    }
    /* Masquer les flèches par défaut dans Chrome, Safari, Edge */
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    .button {
      background-color: #f8f9fa;
      border: none;
      padding: 8px 12px;
      cursor: pointer;
      font-size: 18px;
      line-height: 1;
      user-select: none;
      transition: background-color 0.15s;
    }
    .button:hover {
      background-color: #e2e6ea;
    }
    .button:active {
      background-color: #dae0e5;
    }
    .button:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }
  `;

  /**
   * La valeur actuelle du champ.
   */
  @property({ type: Number })
  value: number = 0;

  /**
   * La valeur minimale autorisée.
   */
  @property({ type: Number })
  min: number = -Infinity;

  /**
   * La valeur maximale autorisée.
   */
  @property({ type: Number })
  max: number = Infinity;

  /**
   * Le pas d'incrémentation/décrémentation.
   */
  @property({ type: Number })
  step: number = 1;

  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let newValue = parseFloat(input.value);

    if (isNaN(newValue)) {
      // Si l'entrée n'est pas un nombre valide, on ne met pas à jour la valeur
      // mais on laisse l'utilisateur continuer à taper.
      return;
    }

    // Appliquer les contraintes min/max
    newValue = Math.max(this.min, Math.min(this.max, newValue));

    // Mettre à jour la propriété value et déclencher un événement
    this.value = newValue;
    this._dispatchChange();
  }

  private _changeValue(delta: number) {
    let newValue = this.value + delta;

    // Appliquer les contraintes min/max
    newValue = Math.max(this.min, Math.min(this.max, newValue));

    if (newValue !== this.value) {
      this.value = newValue;
      this._dispatchChange();
    }
  }

  private _dispatchChange() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const isMinDisabled = this.value <= this.min;
    const isMaxDisabled = this.value >= this.max;

    return html`
      <div class="container">
        <button 
          class="button" 
          @click=${() => this._changeValue(-this.step)} 
          ?disabled=${isMinDisabled}
          aria-label="Décrémenter"
        >
          −
        </button>
        <input
          type="number"
          .value=${this.value.toString()}
          @input=${this._handleInput}
          .min=${this.min.toString()}
          .max=${this.max.toString()}
          .step=${this.step.toString()}
          aria-live="assertive"
        />
        <button 
          class="button" 
          @click=${() => this._changeValue(this.step)} 
          ?disabled=${isMaxDisabled}
          aria-label="Incrémenter"
        >
          +
        </button>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-number-input': AgiNumberInput;
  }
}
