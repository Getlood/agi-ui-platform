import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @typedef {Object} VLA_Metadata
 * @property {string} component_name - Nom du composant (ex: Checkbox)
 * @property {string} tag_name - Tag HTML (ex: agi-checkbox)
 * @property {string} category - Catégorie du composant (form/feedback/display/navigation)
 * @property {number} props_count - Nombre de propriétés du composant
 */

/**
 * Métadonnées VLA pour le composant agi-switch.
 * @type {VLA_Metadata}
 */
const VLA_METADATA = {
  component_name: "Switch",
  tag_name: "agi-switch",
  category: "form",
  props_count: 4,
};

/**
 * Composant Web Component Switch - Interrupteur avec label.
 *
 * @element agi-switch
 *
 * @fires change - Déclenché lorsque l'état de l'interrupteur change.
 *
 * @csspart label - Le conteneur du label.
 * @csspart switch - Le conteneur visuel de l'interrupteur (piste et pouce).
 * @csspart track - La piste de l'interrupteur.
 * @csspart thumb - Le pouce (bouton) de l'interrupteur.
 */
@customElement(VLA_METADATA.tag_name)
export class AgiSwitch extends LitElement {
  /**
   * Indique si l'interrupteur est activé.
   */
  @property({ type: Boolean, reflect: true })
  checked = false;

  /**
   * Le label textuel associé à l'interrupteur.
   */
  @property({ type: String })
  label = '';

  /**
   * Indique si l'interrupteur est désactivé.
   */
  @property({ type: Boolean, reflect: true })
  disabled = false;

  /**
   * Le nom de l'interrupteur pour la soumission de formulaire.
   */
  @property({ type: String })
  name = '';

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      font-family: sans-serif;
      --agi-switch-track-color: #ccc;
      --agi-switch-track-color-checked: #4CAF50;
      --agi-switch-thumb-color: white;
      --agi-switch-thumb-color-checked: white;
      --agi-switch-track-width: 40px;
      --agi-switch-track-height: 20px;
      --agi-switch-thumb-size: 16px;
      --agi-switch-transition-duration: 0.2s;
    }

    :host([disabled]) {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .switch-container {
      display: flex;
      align-items: center;
    }

    .label {
      margin-right: 8px;
      color: #333;
      font-size: 14px;
      line-height: var(--agi-switch-track-height);
      transition: color var(--agi-switch-transition-duration);
    }

    :host([checked]) .label {
      color: #000; /* Peut être ajusté pour indiquer l'état */
    }

    .switch {
      position: relative;
      display: inline-block;
      width: var(--agi-switch-track-width);
      height: var(--agi-switch-track-height);
      border-radius: calc(var(--agi-switch-track-height) / 2);
      background-color: var(--agi-switch-track-color);
      transition: background-color var(--agi-switch-transition-duration);
      box-sizing: border-box;
    }

    :host([checked]) .switch {
      background-color: var(--agi-switch-track-color-checked);
    }

    .thumb {
      position: absolute;
      top: 2px;
      left: 2px;
      width: var(--agi-switch-thumb-size);
      height: var(--agi-switch-thumb-size);
      background-color: var(--agi-switch-thumb-color);
      border-radius: 50%;
      transition: transform var(--agi-switch-transition-duration), background-color var(--agi-switch-transition-duration);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
    }

    :host([checked]) .thumb {
      transform: translateX(calc(var(--agi-switch-track-width) - var(--agi-switch-thumb-size) - 4px));
      background-color: var(--agi-switch-thumb-color-checked);
    }

    /* Masquer l'input natif */
    .hidden-input {
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
      pointer-events: none;
    }
  `;

  private _handleClick() {
    if (this.disabled) {
      return;
    }
    this.checked = !this.checked;
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    return html`
      <label class="switch-container" @click=${this._handleClick}>
        ${this.label ? html`<span class="label" part="label">${this.label}</span>` : ''}
        <div class="switch" part="switch">
          <span class="track" part="track"></span>
          <span class="thumb" part="thumb"></span>
        </div>
        <input
          type="checkbox"
          class="hidden-input"
          .checked=${this.checked}
          .disabled=${this.disabled}
          name=${this.name}
          tabindex="-1"
        >
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-switch': AgiSwitch;
  }
}
