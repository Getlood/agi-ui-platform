import { html, css, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';

export type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default';
export type SizeType = 'small' | 'medium' | 'large';

@customElement('agi-status-indicator')
export class StatusIndicator extends LitElement {
  /**
   * Le type de statut, qui détermine la couleur de l'indicateur.
   */
  @property({ type: String, reflect: true })
  status: StatusType = 'default';

  /**
   * La taille de l'indicateur.
   */
  @property({ type: String, reflect: true })
  size: SizeType = 'medium';

  /**
   * Active ou désactive l'effet de pulsation.
   */
  @property({ type: Boolean, reflect: true })
  pulsing: boolean = false;

  static styles = css`
    :host {
      display: inline-block;
      --status-indicator-color: var(--agi-status-indicator-color-default, #9e9e9e);
      --status-indicator-size: 10px;
    }

    :host([size="small"]) {
      --status-indicator-size: 8px;
    }
    :host([size="medium"]) {
      --status-indicator-size: 12px;
    }
    :host([size="large"]) {
      --status-indicator-size: 16px;
    }

    :host([status="success"]) {
      --status-indicator-color: var(--agi-status-indicator-color-success, #4caf50); /* Vert */
    }
    :host([status="warning"]) {
      --status-indicator-color: var(--agi-status-indicator-color-warning, #ff9800); /* Orange */
    }
    :host([status="error"]) {
      --status-indicator-color: var(--agi-status-indicator-color-error, #f44336); /* Rouge */
    }
    :host([status="info"]) {
      --status-indicator-color: var(--agi-status-indicator-color-info, #2196f3); /* Bleu */
    }

    .indicator-container {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--status-indicator-size);
      height: var(--status-indicator-size);
    }

    .dot {
      width: var(--status-indicator-size);
      height: var(--status-indicator-size);
      border-radius: 50%;
      background-color: var(--status-indicator-color);
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.2);
      transition: background-color 0.3s ease;
    }

    /* Styles pour l'effet de pulsation */
    :host([pulsing]) .dot {
      animation: pulse-color 2s infinite;
    }

    :host([pulsing]) .pulse-ring {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: var(--status-indicator-color);
      opacity: 0;
      animation: pulse-ring 2s infinite;
    }

    @keyframes pulse-ring {
      0% {
        transform: scale(0.3);
        opacity: 0.8;
      }
      100% {
        transform: scale(2.5);
        opacity: 0;
      }
    }

    @keyframes pulse-color {
      0% {
        box-shadow: 0 0 0 0 var(--status-indicator-color);
      }
      70% {
        box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
      }
      100% {
        box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      }
    }
  `;

  render() {
    return html`
      <div class="indicator-container">
        ${this.pulsing ? html`<div class="pulse-ring"></div>` : ''}
        <div class="dot"></div>
      </div>
    `;
  }
}
