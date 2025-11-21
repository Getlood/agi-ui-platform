import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @tag agi-checkbox
 * @summary Un composant de case à cocher avec support pour les états checked et indeterminate.
 * @category form
 * @property {string} label - Le texte du label associé à la case à cocher.
 * @property {boolean} checked - Indique si la case à cocher est cochée.
 * @property {boolean} indeterminate - Indique si la case à cocher est dans un état indéterminé.
 * @property {boolean} disabled - Indique si la case à cocher est désactivée.
 * @fires {CustomEvent<boolean>} change - Événement émis lorsque l'état de la case à cocher change.
 */
@customElement('agi-checkbox')
export class AgiCheckbox extends LitElement {
  /**
   * Le texte du label associé à la case à cocher.
   */
  @property({ type: String })
  label: string = '';

  /**
   * Indique si la case à cocher est cochée.
   */
  @property({ type: Boolean, reflect: true })
  checked: boolean = false;

  /**
   * Indique si la case à cocher est dans un état indéterminé.
   * L'état indéterminé est visuel et ne change pas la valeur de `checked`.
   */
  @property({ type: Boolean, reflect: true })
  indeterminate: boolean = false;

  /**
   * Indique si la case à cocher est désactivée.
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  // État interne pour gérer l'ID unique pour l'accessibilité
  @state()
  private _checkboxId: string = \`checkbox-\${Math.random().toString(36).substring(2, 9)}\`;

  static styles = css\`
    :host {
      display: inline-block;
      --agi-checkbox-size: 18px;
      --agi-checkbox-color: #007bff; /* Couleur primaire */
      --agi-checkbox-border-color: #ccc;
      --agi-checkbox-border-radius: 3px;
      --agi-checkbox-focus-ring: 0 0 0 3px rgba(0, 123, 255, 0.25);
      --agi-checkbox-disabled-color: #aaa;
    }

    .checkbox-container {
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      user-select: none;
      font-family: inherit;
      font-size: 1rem;
      line-height: var(--agi-checkbox-size);
    }

    .checkbox-container:focus-within .custom-checkbox {
      box-shadow: var(--agi-checkbox-focus-ring);
    }

    input[type="checkbox"] {
      /* Masquer la case à cocher native */
      position: absolute;
      opacity: 0;
      width: 0;
      height: 0;
    }

    .custom-checkbox {
      display: inline-block;
      width: var(--agi-checkbox-size);
      height: var(--agi-checkbox-size);
      border: 2px solid var(--agi-checkbox-border-color);
      border-radius: var(--agi-checkbox-border-radius);
      margin-right: 0.5em;
      transition: all 0.2s ease-in-out;
      position: relative;
      flex-shrink: 0;
    }

    /* État coché */
    input[type="checkbox"]:checked + .custom-checkbox {
      background-color: var(--agi-checkbox-color);
      border-color: var(--agi-checkbox-color);
    }

    /* Icône de coche */
    input[type="checkbox"]:checked + .custom-checkbox::after {
      content: '';
      position: absolute;
      top: 2px;
      left: 5px;
      width: 4px;
      height: 8px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }

    /* État indéterminé */
    input[type="checkbox"]:indeterminate + .custom-checkbox {
      background-color: var(--agi-checkbox-color);
      border-color: var(--agi-checkbox-color);
    }

    /* Icône indéterminée (tiret) */
    input[type="checkbox"]:indeterminate + .custom-checkbox::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 60%;
      height: 2px;
      background-color: white;
      transform: translate(-50%, -50%);
      border: none;
    }

    /* État désactivé */
    input[type="checkbox"]:disabled ~ .custom-checkbox {
      border-color: var(--agi-checkbox-disabled-color);
      background-color: #f4f4f4;
      cursor: not-allowed;
    }

    input[type="checkbox"]:disabled ~ .label-text {
      color: var(--agi-checkbox-disabled-color);
      cursor: not-allowed;
    }

    input[type="checkbox"]:disabled:checked + .custom-checkbox {
      background-color: var(--agi-checkbox-disabled-color);
      border-color: var(--agi-checkbox-disabled-color);
    }

    input[type="checkbox"]:disabled:checked + .custom-checkbox::after {
      border-color: #fff;
    }

    input[type="checkbox"]:disabled:indeterminate + .custom-checkbox {
      background-color: var(--agi-checkbox-disabled-color);
      border-color: var(--agi-checkbox-disabled-color);
    }

    input[type="checkbox"]:disabled:indeterminate + .custom-checkbox::after {
      background-color: #fff;
    }

    .label-text {
      line-height: 1.2;
    }
  \`;

  private _handleChange(e: Event) {
    if (this.disabled) {
      e.preventDefault();
      return;
    }

    const target = e.target as HTMLInputElement;
    this.checked = target.checked;
    this.indeterminate = false; // L'interaction utilisateur supprime l'état indéterminé

    /**
     * Événement émis lorsque l'état de la case à cocher change.
     * @event change
     * @type {CustomEvent<boolean>}
     */
    this.dispatchEvent(new CustomEvent('change', {
      detail: this.checked,
      bubbles: true,
      composed: true,
    }));
  }

  // Lit met à jour l'attribut 'indeterminate' sur l'élément input
  // après le rendu.
  protected firstUpdated() {
    this._updateIndeterminate();
  }

  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('indeterminate')) {
      this._updateIndeterminate();
    }
  }

  private _updateIndeterminate() {
    const input = this.shadowRoot?.querySelector('input');
    if (input) {
      input.indeterminate = this.indeterminate;
    }
  }

  render() {
    return html\`
      <label for=\${this._checkboxId} class="checkbox-container">
        <input
          type="checkbox"
          id=\${this._checkboxId}
          .checked=\${this.checked}
          ?disabled=\${this.disabled}
          @change=\${this._handleChange}
          aria-checked=\${this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false'}
        />
        <span class="custom-checkbox" part="control"></span>
        <span class="label-text" part="label">
          <slot>\${this.label}</slot>
        </span>
      </label>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-checkbox': AgiCheckbox;
  }
}
