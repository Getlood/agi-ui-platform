import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @component agi-skeleton
 * @description Un composant Web Component pour afficher un placeholder de chargement (skeleton screen).
 * @category display
 * @prop {string} width - La largeur du placeholder (ex: '100%', '200px').
 * @prop {string} height - La hauteur du placeholder (ex: '1em', '50px').
 * @prop {string} variant - La forme du placeholder ('text', 'circle', 'rect').
 * @prop {boolean} animated - Active ou désactive l'animation de chargement.
 */
@customElement('agi-skeleton')
export class AgiSkeleton extends LitElement {
  static styles = css`
    :host {
      display: block;
      background-color: var(--agi-skeleton-color, #e0e0e0);
      border-radius: 4px;
      line-height: 1;
      position: relative;
      overflow: hidden;
    }

    :host([variant='circle']) {
      border-radius: 50%;
    }

    :host([variant='text']) {
      /* Simule la hauteur d'une ligne de texte */
      height: 1em;
      transform: scale(1, 0.6);
      margin-top: 0;
      margin-bottom: 0;
      border-radius: 3px;
    }

    :host([animated]) {
      /* Animation de balayage */
      --agi-skeleton-highlight: rgba(255, 255, 255, 0.4);
      animation: loading 1.5s infinite;
    }

    :host([animated])::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        90deg,
        transparent,
        var(--agi-skeleton-highlight),
        transparent
      );
      transform: translateX(-100%);
      animation: sweep 1.5s infinite;
    }

    @keyframes loading {
      0% {
        opacity: 0.6;
      }
      50% {
        opacity: 1;
      }
      100% {
        opacity: 0.6;
      }
    }

    @keyframes sweep {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }
  `;

  /**
   * La largeur du placeholder (ex: '100%', '200px').
   */
  @property({ type: String, reflect: true })
  width: string = '100%';

  /**
   * La hauteur du placeholder (ex: '1em', '50px').
   */
  @property({ type: String, reflect: true })
  height: string = '1em';

  /**
   * La forme du placeholder ('text', 'circle', 'rect').
   */
  @property({ type: String, reflect: true })
  variant: 'text' | 'circle' | 'rect' = 'rect';

  /**
   * Active ou désactive l'animation de chargement.
   */
  @property({ type: Boolean, reflect: true })
  animated: boolean = true;

  render() {
    this.style.width = this.width;
    this.style.height = this.height;

    return html``;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-skeleton': AgiSkeleton;
  }
}
