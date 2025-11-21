import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Interface pour définir une action de notification.
 */
interface NotificationAction {
  label: string;
  callback: () => void;
  primary?: boolean;
}

/**
 * Type pour les différents types de notification.
 */
type NotificationType = 'info' | 'success' | 'warning' | 'error';

/**
 * Composant Web Component pour une notification système avec actions.
 * 
 * @tag agi-notification-system
 * @category feedback
 * @property {string} message - Le message principal de la notification.
 * @property {NotificationType} type - Le type de la notification (info, success, warning, error).
 * @property {NotificationAction[]} actions - Un tableau d'actions (boutons) pour l'utilisateur.
 * @property {string} [title] - Un titre optionnel pour la notification.
 * @property {boolean} [dismissible=true] - Indique si la notification peut être fermée.
 */
@customElement('agi-notification-system')
export class AgiNotificationSystem extends LitElement {
  static styles = css`
    :host {
      display: block;
      box-sizing: border-box;
      font-family: sans-serif;
    }

    .notification {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      border-radius: 4px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      color: var(--agi-notification-text-color, #333);
      background-color: var(--agi-notification-bg-color, #fff);
      border-left: 5px solid;
      transition: opacity 0.3s ease-in-out;
    }

    .notification.hidden {
      opacity: 0;
      height: 0;
      padding: 0;
      margin: 0;
      overflow: hidden;
    }

    /* Couleurs de type */
    .notification.info {
      border-left-color: #2196F3; /* Bleu */
      background-color: #E3F2FD;
    }
    .notification.success {
      border-left-color: #4CAF50; /* Vert */
      background-color: #E8F5E9;
    }
    .notification.warning {
      border-left-color: #FFC107; /* Jaune */
      background-color: #FFFDE7;
    }
    .notification.error {
      border-left-color: #F44336; /* Rouge */
      background-color: #FFEBEE;
    }

    .icon {
      margin-right: 12px;
      font-size: 24px;
      line-height: 1;
    }

    .content {
      flex-grow: 1;
    }

    .title {
      font-weight: bold;
      margin-bottom: 4px;
      font-size: 1.1em;
    }

    .message {
      margin-bottom: 8px;
      font-size: 0.9em;
    }

    .actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .action-button {
      padding: 8px 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-weight: 600;
      transition: background-color 0.2s;
    }

    .action-button.primary {
      background-color: #2196F3;
      color: white;
    }

    .action-button.primary:hover {
      background-color: #1976D2;
    }

    .action-button:not(.primary) {
      background-color: #ccc;
      color: #333;
    }

    .action-button:not(.primary):hover {
      background-color: #bbb;
    }

    .dismiss-button {
      background: none;
      border: none;
      font-size: 18px;
      line-height: 1;
      cursor: pointer;
      margin-left: 16px;
      padding: 0;
      color: #999;
    }

    .dismiss-button:hover {
      color: #333;
    }
  `;

  @property({ type: String })
  message: string = '';

  @property({ type: String })
  type: NotificationType = 'info';

  @property({ type: Array })
  actions: NotificationAction[] = [];

  @property({ type: String })
  title?: string;

  @property({ type: Boolean })
  dismissible: boolean = true;

  @property({ type: Boolean, state: true })
  private _hidden: boolean = false;

  private _getIcon() {
    switch (this.type) {
      case 'success':
        return '✓'; // Unicode checkmark (or use a proper icon library like Material Icons)
      case 'warning':
        return '⚠'; // Unicode warning sign
      case 'error':
        return '✖'; // Unicode multiplication sign
      case 'info':
      default:
        return 'i'; // Simple 'i' for info
    }
  }

  private _handleAction(callback: () => void) {
    callback();
    // Optionnel: Fermer la notification après une action
    // this.dismiss();
  }

  dismiss() {
    this._hidden = true;
    this.dispatchEvent(new CustomEvent('agi-notification-dismiss', {
      detail: { type: this.type, message: this.message },
      bubbles: true,
      composed: true
    }));
  }

  render() {
    const classes = {
      notification: true,
      [this.type]: true,
      hidden: this._hidden,
    };

    if (this._hidden) {
        return html``; // Ne rien rendre si caché
    }

    return html`
      <div class=${classMap(classes)} role="alert">
        <div class="icon">${this._getIcon()}</div>
        <div class="content">
          ${this.title ? html`<div class="title">${this.title}</div>` : ''}
          <div class="message">${this.message}</div>
          ${this.actions.length > 0
            ? html`
                <div class="actions">
                  ${this.actions.map(
                    (action) => html`
                      <button
                        class=${classMap({
                          'action-button': true,
                          primary: action.primary ?? false,
                        })}
                        @click=${() => this._handleAction(action.callback)}
                      >
                        ${action.label}
                      </button>
                    `
                  )}
                </div>
              `
            : ''}
        </div>
        ${this.dismissible
          ? html`
              <button class="dismiss-button" @click=${this.dismiss} aria-label="Fermer la notification">
                &times;
              </button>
            `
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-notification-system': AgiNotificationSystem;
  }
}
