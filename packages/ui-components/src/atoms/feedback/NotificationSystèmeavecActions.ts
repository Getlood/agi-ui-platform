import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

/**
 * @component agi-loading-indicator
 * @description Un indicateur de chargement visuel simple et personnalisable.
 * @category feedback
 * @prop {string} size - La taille de l'indicateur ('small', 'medium', 'large'). Par défaut: 'medium'.
 * @prop {string} color - La couleur de l'indicateur (nom de couleur CSS ou hexadécimal). Par défaut: 'currentColor'.
 * @prop {boolean} active - Indique si l'indicateur est visible et animé. Par défaut: true.
 */
@customElement('agi-loading-indicator')
export class AgiLoadingIndicator extends LitElement {
  static styles = [
    css`
      :host {
        display: inline-block;
        line-height: 0;
        /* Variables CSS pour la personnalisation */
        --agi-loading-color: currentColor;
        --agi-loading-size-small: 16px;
        --agi-loading-size-medium: 32px;
        --agi-loading-size-large: 48px;
        --agi-loading-border-small: 2px;
        --agi-loading-border-medium: 4px;
        --agi-loading-border-large: 6px;
      }

      :host([hidden]) {
        display: none;
      }

      .spinner {
        display: inline-block;
        border-radius: 50%;
        border-style: solid;
        border-color: rgba(0, 0, 0, 0.1); /* Couleur de fond de l'anneau */
        border-left-color: var(--agi-loading-color); /* Couleur de l'indicateur */
        animation: spin 1s linear infinite;
        box-sizing: border-box;
      }

      /* Tailles */
      .spinner.small {
        width: var(--agi-loading-size-small);
        height: var(--agi-loading-size-small);
        border-width: var(--agi-loading-border-small);
      }

      .spinner.medium {
        width: var(--agi-loading-size-medium);
        height: var(--agi-loading-size-medium);
        border-width: var(--agi-loading-border-medium);
      }

      .spinner.large {
        width: var(--agi-loading-size-large);
        height: var(--agi-loading-size-large);
        border-width: var(--agi-loading-border-large);
      }

      @keyframes spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    `,
    // Style pour l'accessibilité (visuellement caché)
    css`
      .visually-hidden {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
      }
    `
  ];

  /**
   * La taille de l'indicateur ('small', 'medium', 'large').
   */
  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * La couleur de l'indicateur (nom de couleur CSS ou hexadécimal).
   */
  @property({ type: String })
  color: string = 'currentColor';

  /**
   * Indique si l'indicateur est visible et animé.
   */
  @property({ type: Boolean, reflect: true })
  active: boolean = true;

  connectedCallback() {
    super.connectedCallback();
    // Assure que l'attribut 'hidden' est mis à jour initialement
    this.updateHiddenAttribute();
  }

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('active')) {
      this.updateHiddenAttribute();
    }
    if (changedProperties.has('color')) {
      this.style.setProperty('--agi-loading-color', this.color);
    }
  }

  private updateHiddenAttribute() {
    if (this.active) {
      this.removeAttribute('hidden');
    } else {
      this.setAttribute('hidden', '');
    }
  }

  render() {
    // Utilisation de role="status" pour indiquer un contenu qui change dynamiquement
    // et aria-live="polite" pour que les lecteurs d'écran annoncent le changement
    // de l'état de chargement.
    return html`
      <div class="spinner ${this.size}" role="status" aria-live="polite">
        <span class="visually-hidden">Chargement en cours...</span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-loading-indicator': AgiLoadingIndicator;
  }
}
