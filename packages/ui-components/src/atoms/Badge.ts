import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('agi-badge')
export class AgiBadge extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 12px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 500;
      font-family: system-ui, -apple-system, sans-serif;
    }

    .success {
      background: #c6f6d5;
      color: #22543d;
    }

    .warning {
      background: #feebc8;
      color: #7c2d12;
    }

    .error {
      background: #fed7d7;
      color: #742a2a;
    }

    .info {
      background: #bee3f8;
      color: #2c5282;
    }

    .neutral {
      background: #e2e8f0;
      color: #2d3748;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: currentColor;
    }
  `;

  @property({ type: String })
  variant: 'success' | 'warning' | 'error' | 'info' | 'neutral' = 'neutral';

  @property({ type: String })
  label = '';

  @property({ type: Boolean })
  dot = false;

  render() {
    return html`
      <span class="badge ${this.variant}">
        ${this.dot ? html`<span class="dot"></span>` : ''}
        ${this.label}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-badge': AgiBadge;
  }
}
