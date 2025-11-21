import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * Composant Input atomique
 * 
 * @fires input - Déclenché lors de la saisie
 * @fires change - Déclenché lors du changement de valeur
 * 
 * @example
 * ```html
 * <agi-input
 *   label="Email"
 *   type="email"
 *   placeholder="votre@email.com"
 *   required
 * ></agi-input>
 * ```
 */
@customElement('agi-input')
export class AgiInput extends LitElement {
  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .input-wrapper {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    label {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      color: #2d3748;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .required {
      color: #e53e3e;
    }

    .input-container {
      position: relative;
      display: flex;
      align-items: center;
    }

    input {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      padding: 10px 12px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      width: 100%;
      transition: all 0.2s ease;
      background: white;
      color: #2d3748;
    }

    input:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    input:disabled {
      background: #f7fafc;
      cursor: not-allowed;
      opacity: 0.6;
    }

    input.error {
      border-color: #e53e3e;
    }

    input.error:focus {
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }

    .error-message {
      font-size: 12px;
      color: #e53e3e;
      margin-top: 4px;
    }

    .helper-text {
      font-size: 12px;
      color: #718096;
      margin-top: 4px;
    }

    .icon {
      position: absolute;
      right: 12px;
      color: #a0aec0;
      pointer-events: none;
    }
  `;

  @property({ type: String })
  label = '';

  @property({ type: String })
  type: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' = 'text';

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  value = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  disabled = false;

  @property({ type: String })
  error = '';

  @property({ type: String })
  helperText = '';

  @property({ type: String })
  icon?: string;

  @property({ type: String })
  name = '';

  @state()
  private internalValue = '';

  connectedCallback() {
    super.connectedCallback();
    this.internalValue = this.value;
  }

  private handleInput(e: Event) {
    const input = e.target as HTMLInputElement;
    this.internalValue = input.value;
    
    this.dispatchEvent(
      new CustomEvent('agi-input', {
        detail: { value: this.internalValue, name: this.name },
        bubbles: true,
        composed: true,
      })
    );
  }

  private handleChange(e: Event) {
    const input = e.target as HTMLInputElement;
    this.value = input.value;
    
    this.dispatchEvent(
      new CustomEvent('agi-change', {
        detail: { value: this.value, name: this.name },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    return html`
      <div class="input-wrapper">
        ${this.label
          ? html`
              <label>
                ${this.label}
                ${this.required ? html`<span class="required">*</span>` : ''}
              </label>
            `
          : ''}
        
        <div class="input-container">
          <input
            type=${this.type}
            placeholder=${this.placeholder}
            .value=${this.internalValue}
            ?required=${this.required}
            ?disabled=${this.disabled}
            name=${this.name}
            class=${this.error ? 'error' : ''}
            @input=${this.handleInput}
            @change=${this.handleChange}
          />
          ${this.icon ? html`<span class="icon">${this.icon}</span>` : ''}
        </div>

        ${this.error
          ? html`<div class="error-message">${this.error}</div>`
          : this.helperText
          ? html`<div class="helper-text">${this.helperText}</div>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-input': AgiInput;
  }
}
