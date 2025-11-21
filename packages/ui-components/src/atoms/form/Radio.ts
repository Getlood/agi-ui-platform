import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @component agi-radio
 * @description Un bouton radio stylisé avec un label.
 * @category form
 * @tag agi-radio
 * @props_count 4
 *
 * @slot - Le contenu du label du bouton radio.
 */
@customElement('agi-radio')
export class AgiRadio extends LitElement {
  static styles = css\`
    :host {
      display: inline-block;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }

    .radio-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .radio-input {
      /* Masquer l'input natif */
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .radio-custom {
      display: inline-block;
      width: 18px;
      height: 18px;
      border-radius: 50%;
      border: 2px solid var(--agi-radio-border-color, #ccc);
      transition: all 0.2s ease-in-out;
      flex-shrink: 0;
      position: relative;
    }

    .radio-custom::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: var(--agi-radio-checked-color, #007bff);
      transition: transform 0.2s ease-in-out;
    }

    .radio-input:checked + .radio-custom {
      border-color: var(--agi-radio-checked-color, #007bff);
    }

    .radio-input:checked + .radio-custom::after {
      transform: translate(-50%, -50%) scale(1);
    }

    .radio-input:focus-visible + .radio-custom {
      outline: 2px solid var(--agi-radio-focus-color, #007bff);
      outline-offset: 2px;
    }

    .radio-label {
      color: var(--agi-radio-label-color, #333);
      user-select: none;
    }

    /* Styles pour l'état désactivé */
    .radio-input:disabled ~ .radio-custom {
      border-color: var(--agi-radio-disabled-border-color, #eee);
      background-color: var(--agi-radio-disabled-bg-color, #f9f9f9);
      cursor: not-allowed;
    }

    .radio-input:disabled ~ .radio-custom::after {
      background-color: var(--agi-radio-disabled-dot-color, #ccc);
    }

    .radio-input:disabled ~ .radio-label {
      color: var(--agi-radio-disabled-label-color, #999);
      cursor: not-allowed;
    }
  \`;

  /**
   * La valeur à soumettre avec le formulaire.
   */
  @property({ type: String })
  value: string = '';

  /**
   * Le nom du groupe de boutons radio. Les boutons avec le même nom sont mutuellement exclusifs.
   */
  @property({ type: String })
  name: string = '';

  /**
   * Indique si le bouton radio est sélectionné.
   */
  @property({ type: Boolean, reflect: true })
  checked: boolean = false;

  /**
   * Indique si le bouton radio est désactivé.
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  private _id: string = \`radio-\${Math.random().toString(36).substring(2, 9)}\`;

  private _handleChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;

    // Émettre un événement 'change' natif pour l'intégration de formulaire
    this.dispatchEvent(new CustomEvent('change', {
      detail: {
        value: this.value,
        checked: this.checked,
        name: this.name,
      },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html\`
      <label for="\${this._id}" class="radio-container">
        <input
          id="\${this._id}"
          type="radio"
          class="radio-input"
          .value="\${this.value}"
          name="\${this.name}"
          .checked="\${this.checked}"
          ?disabled="\${this.disabled}"
          @change="\${this._handleChange}"
        />
        <span class="radio-custom"></span>
        <span class="radio-label">
          <slot></slot>
        </span>
      </label>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-radio': AgiRadio;
  }
}
