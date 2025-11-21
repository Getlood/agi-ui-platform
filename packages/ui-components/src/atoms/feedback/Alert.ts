import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @tag agi-toast
 * @component_name Toast
 * @category feedback
 * @props_count 4
 *
 * Un composant Web Component pour afficher des notifications temporaires (toasts).
 * La notification se ferme automatiquement après une durée spécifiée.
 */
@customElement('agi-toast')
export class AgiToast extends LitElement {
  /**
   * Le message à afficher dans la notification.
   */
  @property({ type: String })
  message: string = '';

  /**
   * La durée en millisecondes avant que la notification ne se ferme automatiquement.
   * Si la valeur est 0 ou négative, la notification reste ouverte jusqu'à une action utilisateur.
   */
  @property({ type: Number })
  duration: number = 3000;

  /**
   * Le type de la notification, qui influence son style (couleur, icône).
   * Les valeurs possibles sont 'info', 'success', 'warning', 'error'.
   */
  @property({ type: String })
  type: 'info' | 'success' | 'warning' | 'error' = 'info';

  /**
   * Indique si la notification est actuellement visible.
   */
  @state()
  private _visible: boolean = false;

  private _timer: number | undefined;

  static styles = css\`
    :host {
      display: block;
      position: fixed;
      bottom: 20px;
      right: 20px;
      z-index: 1000;
      transition: opacity 0.3s ease-in-out, transform 0.3s ease-in-out;
      opacity: 0;
      transform: translateY(100%);
    }

    :host([visible]) {
      opacity: 1;
      transform: translateY(0);
    }

    .toast {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      color: #fff;
      min-width: 250px;
      max-width: 400px;
    }

    .toast-info { background-color: #2196F3; } /* Bleu */
    .toast-success { background-color: #4CAF50; } /* Vert */
    .toast-warning { background-color: #FFC107; color: #333; } /* Jaune */
    .toast-error { background-color: #F44336; } /* Rouge */

    .icon {
      margin-right: 10px;
      font-size: 20px;
      /* Utilisation d'un fallback simple pour les icônes (par exemple, des lettres)
         Dans un environnement de production, on utiliserait une librairie d'icônes. */
    }

    .close-btn {
      background: none;
      border: none;
      color: inherit;
      font-size: 18px;
      margin-left: auto;
      cursor: pointer;
      padding: 0 5px;
      line-height: 1;
    }
  \`;

  /**
   * Mappe le type de toast à un caractère d'icône simple pour l'exemple.
   * En production, on utiliserait des icônes SVG ou une police d'icônes.
   */
  private _getIcon() {
    switch (this.type) {
      case 'success':
        return '✓';
      case 'error':
        return '✗';
      case 'warning':
        return '!';
      case 'info':
      default:
        return 'i';
    }
  }

  /**
   * Affiche la notification.
   */
  public show() {
    this._visible = true;
    this.setAttribute('visible', '');
    this._startTimer();
  }

  /**
   * Cache la notification.
   */
  public hide() {
    this._visible = false;
    this.removeAttribute('visible');
    this._clearTimer();
  }

  private _startTimer() {
    this._clearTimer();
    if (this.duration > 0) {
      this._timer = window.setTimeout(() => {
        this.hide();
      }, this.duration);
    }
  }

  private _clearTimer() {
    if (this._timer) {
      clearTimeout(this._timer);
      this._timer = undefined;
    }
  }

  // Gère le cycle de vie pour s'assurer que le timer est nettoyé si le composant est retiré du DOM
  disconnectedCallback() {
    super.disconnectedCallback();
    this._clearTimer();
  }

  render() {
    if (!this.message) {
      return html\`\`;
    }

    return html\`
      <div class="toast toast-\${this.type}">
        <span class="icon">\${this._getIcon()}</span>
        <div class="message">\${this.message}</div>
        <button class="close-btn" @click="\${this.hide}">×</button>
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-toast': AgiToast;
  }
}

// Exemple d'utilisation (non inclus dans le composant final, mais utile pour le test)
/*
const toast = document.createElement('agi-toast') as AgiToast;
toast.message = "Opération réussie !";
toast.type = 'success';
toast.duration = 5000;
document.body.appendChild(toast);
toast.show();
*/
