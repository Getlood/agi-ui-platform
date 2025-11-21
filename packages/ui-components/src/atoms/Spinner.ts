import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('agi-spinner')
export class AgiSpinner extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .spinner {
      border: 3px solid rgba(0, 0, 0, 0.1);
      border-top-color: #667eea;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .small {
      width: 16px;
      height: 16px;
      border-width: 2px;
    }

    .medium {
      width: 32px;
      height: 32px;
      border-width: 3px;
    }

    .large {
      width: 48px;
      height: 48px;
      border-width: 4px;
    }

    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `;

  @property({ type: String })
  size: 'small' | 'medium' | 'large' = 'medium';

  render() {
    return html`<div class="spinner ${this.size}"></div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-spinner': AgiSpinner;
  }
}
