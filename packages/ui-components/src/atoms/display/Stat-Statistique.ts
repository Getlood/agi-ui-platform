import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @tag agi-stat
 * @summary Composant d'affichage de statistique avec valeur et indicateur de changement.
 * @category display
 * @component
 * @prop {string} value - La valeur principale de la statistique (ex: "12.5k", "€1,234").
 * @prop {string} change - La valeur du changement (ex: "+5%", "-2.3%").
 * @prop {boolean} isPositive - Indique si le changement est positif (true) ou négatif (false).
 * @prop {string} label - Un libellé optionnel pour la statistique.
 *
 * @cssprop [--agi-stat-value-font-size=2rem] - Taille de la police pour la valeur principale.
 * @cssprop [--agi-stat-change-font-size=0.9rem] - Taille de la police pour l'indicateur de changement.
 * @cssprop [--agi-stat-positive-color=green] - Couleur pour un changement positif.
 * @cssprop [--agi-stat-negative-color=red] - Couleur pour un changement négatif.
 */
@customElement('agi-stat')
export class AgiStat extends LitElement {
  static styles = css\`
    :host {
      display: block;
      font-family: sans-serif;
      padding: 16px;
      border: 1px solid #eee;
      border-radius: 4px;
    }

    .stat-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .stat-label {
      font-size: 0.8rem;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stat-main {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .stat-value {
      font-size: var(--agi-stat-value-font-size, 2rem);
      font-weight: 600;
      color: #333;
    }

    .stat-change {
      font-size: var(--agi-stat-change-font-size, 0.9rem);
      font-weight: 500;
      padding: 2px 6px;
      border-radius: 3px;
    }

    .stat-change.positive {
      color: var(--agi-stat-positive-color, #28a745); /* Green */
      background-color: rgba(40, 167, 69, 0.1);
    }

    .stat-change.negative {
      color: var(--agi-stat-negative-color, #dc3545); /* Red */
      background-color: rgba(220, 53, 69, 0.1);
    }

    .stat-change.neutral {
      color: #6c757d; /* Gray */
      background-color: #f8f9fa;
    }
  \`;

  @property({ type: String })
  value: string = '0';

  @property({ type: String })
  change: string = '';

  @property({ type: Boolean })
  isPositive: boolean = false;

  @property({ type: String })
  label: string = '';

  private get changeClass(): string {
    if (this.change.startsWith('+') || this.isPositive) {
      return 'positive';
    }
    if (this.change.startsWith('-') || (!this.isPositive && this.change !== '')) {
      return 'negative';
    }
    return 'neutral';
  }

  render() {
    return html`
      <div class="stat-container">
        ${this.label ? html`<div class="stat-label">${this.label}</div>` : ''}
        <div class="stat-main">
          <div class="stat-value">${this.value}</div>
          ${this.change
            ? html`<div class="stat-change ${this.changeClass}">${this.change}</div>`
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-stat': AgiStat;
  }
}
