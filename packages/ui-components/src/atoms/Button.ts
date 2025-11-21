import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Composant Button atomique
 * 
 * @fires click - Déclenché lors du clic sur le bouton
 * 
 * @csspart button - Le bouton natif
 * 
 * @example
 * ```html
 * <agi-button variant="primary" label="Cliquez-moi"></agi-button>
 * ```
 */
@customElement('agi-button')
export class AgiButton extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    button {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      font-weight: 500;
      padding: 10px 20px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Variants */
    .primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    }

    .secondary {
      background: white;
      color: #667eea;
      border: 2px solid #667eea;
    }

    .secondary:hover:not(:disabled) {
      background: #f7fafc;
      transform: translateY(-1px);
    }

    .danger {
      background: linear-gradient(135deg, #f56565 0%, #c53030 100%);
      color: white;
    }

    .danger:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 101, 101, 0.4);
    }

    .ghost {
      background: transparent;
      color: #4a5568;
      border: none;
    }

    .ghost:hover:not(:disabled) {
      background: #f7fafc;
    }

    /* Sizes */
    .small {
      padding: 6px 12px;
      font-size: 12px;
    }

    .medium {
      padding: 10px 20px;
      font-size: 14px;
    }

    .large {
      padding: 14px 28px;
      font-size: 16px;
    }

    /* Loading state */
    .loading {
      position: relative;
      pointer-events: none;
    }

    .loading::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      top: 50%;
      left: 50%;
      margin-left: -8px;
      margin-top: -8px;
      border: 2px solid transparent;
      border-top-color: currentColor;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  @property({ type: String })
  variant: 'primary' | 'secondary' | 'danger' | 'ghost' = 'primary';

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  @property({ type: String })
  label = 'Button';

  @property({ type: Boolean })
  disabled = false;

  @property({ type: Boolean })
  loading = false;

  @property({ type: String })
  icon?: string;

  private handleClick(e: Event) {
    if (this.disabled || this.loading) {
      e.preventDefault();
      return;
    }
    
    this.dispatchEvent(
      new CustomEvent('agi-click', {
        detail: { label: this.label },
        bubbles: true,
        composed: true,
      })
    );
  }

  render() {
    const classes = [
      this.variant,
      this.size,
      this.loading ? 'loading' : '',
    ].join(' ');

    return html`
      <button
        part="button"
        class=${classes}
        ?disabled=${this.disabled || this.loading}
        @click=${this.handleClick}
      >
        ${this.icon && !this.loading
          ? html`<span class="icon">${this.icon}</span>`
          : ''}
        ${!this.loading ? this.label : ''}
      </button>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-button': AgiButton;
  }
}
