import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @typedef {'info' | 'success' | 'error'} SnackbarVariant
 */

/**
 * Composant Web Component pour afficher un message temporaire (Snackbar) en bas de l'écran.
 *
 * @element agi-snackbar
 * @fires close - Déclenché lorsque le snackbar se ferme (automatiquement ou manuellement).
 * @fires action-click - Déclenché lorsque l'utilisateur clique sur le bouton d'action.
 */
@customElement('agi-snackbar')
export class AgiSnackbar extends LitElement {
  static styles = css`
    :host {
      display: contents; /* Permet de ne pas interférer avec le positionnement */
    }

    .snackbar {
      position: fixed;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      min-width: 288px;
      max-width: 568px;
      padding: 14px 24px;
      border-radius: 4px;
      box-shadow: 0 3px 5px -1px rgba(0, 0, 0, 0.2),
                  0 6px 10px 0 rgba(0, 0, 0, 0.14),
                  0 1px 18px 0 rgba(0, 0, 0, 0.12);
      color: white;
      background-color: #323232; /* Couleur de fond par défaut */
      display: flex;
      justify-content: space-between;
      align-items: center;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s, visibility 0.3s, transform 0.3s;
      z-index: 1000; /* Assure que le snackbar est au-dessus des autres éléments */
    }

    .snackbar.open {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%);
    }

    .message {
      flex-grow: 1;
      font-size: 14px;
      line-height: 20px;
      margin-right: 24px;
    }

    .action-button {
      background: none;
      border: none;
      color: #bb86fc; /* Couleur d'action par défaut (similaire à Material Design) */
      font-weight: 500;
      text-transform: uppercase;
      cursor: pointer;
      padding: 8px;
      margin: -8px; /* Pour augmenter la zone de clic sans changer la taille du snackbar */
      font-size: 14px;
      line-height: 20px;
      outline: none;
    }

    .action-button:hover {
        opacity: 0.8;
    }

    /* Variantes de style */
    .snackbar.success {
        background-color: #4CAF50; /* Vert */
    }

    .snackbar.error {
        background-color: #F44336; /* Rouge */
    }

    .snackbar.info {
        background-color: #2196F3; /* Bleu */
    }
  `;

  /**
   * Indique si le snackbar est visible.
   */
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  /**
   * Le message à afficher dans le snackbar.
   */
  @property({ type: String })
  message: string = '';

  /**
   * Le libellé du bouton d'action optionnel.
   * Si vide, le bouton n'est pas affiché.
   */
  @property({ type: String, attribute: 'action-label' })
  actionLabel: string = '';

  /**
   * La durée en millisecondes avant que le snackbar ne se ferme automatiquement.
   * Mettre à 0 ou négatif pour désactiver l'auto-fermeture.
   */
  @property({ type: Number })
  duration: number = 5000;

  /**
   * Le type de message pour la coloration (info, success, error).
   */
  @property({ type: String, reflect: true })
  variant: 'info' | 'success' | 'error' = 'info';

  @state()
  private _timerId: number | null = null;

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('open')) {
      if (this.open) {
        this._startTimer();
      } else {
        this._clearTimer();
      }
    }

    if (changedProperties.has('duration') && this.open) {
        // Redémarrer le timer si la durée change pendant que le snackbar est ouvert
        this._startTimer();
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimer();
  }

  private _startTimer() {
    this._clearTimer();
    if (this.open && this.duration > 0) {
      this._timerId = window.setTimeout(() => {
        this.closeSnackbar();
      }, this.duration);
    }
  }

  private _clearTimer() {
    if (this._timerId !== null) {
      window.clearTimeout(this._timerId);
      this._timerId = null;
    }
  }

  private closeSnackbar() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }));
  }

  private handleActionClick() {
    this.dispatchEvent(new CustomEvent('action-click', { bubbles: true, composed: true }));
    // Optionnel: fermer le snackbar après l'action, mais souvent l'action elle-même
    // implique une fermeture ou une mise à jour de l'état.
    // this.closeSnackbar();
  }

  render() {
    const classes = {
      snackbar: true,
      open: this.open,
      [this.variant]: true,
    };

    const classString = Object.entries(classes)
        .filter(([, value]) => value)
        .map(([key]) => key)
        .join(' ');

    return html`
      <div class="${classString}">
        <div class="message">${this.message}</div>
        ${this.actionLabel
          ? html`<button class="action-button" @click="${this.handleActionClick}">${this.actionLabel}</button>`
          : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-snackbar': AgiSnackbar;
  }
}
