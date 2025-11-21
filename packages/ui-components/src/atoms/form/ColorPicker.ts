import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Composant de notation par étoiles (Rating)
 * 
 * @tag agi-rating
 * @category feedback
 * 
 * @property {number} value - La valeur de notation actuelle (nombre d'étoiles remplies).
 * @fires {CustomEvent} change - Événement émis lorsque la valeur de notation change.
 * @summary Composant de notation par étoiles (Rating) pour afficher ou sélectionner une note.
 * @property {number} max - Le nombre maximum d'étoiles.
 */
@customElement('agi-rating')
export class AgiRating extends LitElement {
  /**
   * La valeur de notation actuelle (nombre d'étoiles remplies).
   */
  @property({ type: Number })
  value = 0;

  /**
   * Le nombre maximum d'étoiles.
   */
  @property({ type: Number })
  max = 5;

  static styles = css`
    :host {
      display: inline-block;
      font-size: 24px; /* Taille par défaut des étoiles */
      line-height: 1;
    }

    .rating-container {
      cursor: pointer;
      display: inline-block;
    }

    .star {
      color: #ccc; /* Couleur par défaut (vide) */
      transition: color 0.2s;
      display: inline-block;
      padding: 0 2px;
    }

    .star.filled {
      color: gold; /* Couleur des étoiles remplies */
    }

    .star:hover,
    .star:hover ~ .star {
      color: #ffdd00; /* Couleur au survol */
    }

    .rating-container:hover .star.filled {
      color: #ccc; /* Réinitialiser la couleur remplie au survol du conteneur */
    }

    .rating-container:hover .star:hover,
    .rating-container:hover .star:hover ~ .star {
      color: #ffdd00; /* Appliquer la couleur de survol */
    }
  `;

  render() {
    return html`
      <div class="rating-container" @click="${this._handleStarClick}">
        ${Array.from({ length: this.max }, (_, index) => index + 1).map(starIndex =>
          html`<span 
            class="star ${starIndex <= this.value ? 'filled' : ''}"
            data-value="${starIndex}"
          >★</span>`
        )}
      </div>
    `;
  }

  private _handleStarClick(e: Event) {
    // Empêche la propagation de l'événement pour éviter les interférences
    e.stopPropagation();
    const target = e.target as HTMLElement;
    const value = target.dataset.value;

    if (value) {
      const newValue = parseInt(value, 10);
      this.value = newValue;
      
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: newValue },
        bubbles: true,
        composed: true,
      }));
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-rating': AgiRating;
  }
}
