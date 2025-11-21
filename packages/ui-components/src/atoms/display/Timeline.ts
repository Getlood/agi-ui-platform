import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * @typedef {'left' | 'right'} IconPosition
 * @typedef {'up' | 'down' | 'neutral'} Trend
 */

/**
 * Composant Web Component pour afficher un Indicateur de Performance Clé (KPI).
 * 
 * @element agi-kpi
 * 
 * @fires kpi-clicked - Déclenché lorsque l'utilisateur clique sur le composant.
 */
@customElement('agi-kpi')
export class AgiKpi extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
      border: 1px solid var(--agi-kpi-border-color, #e0e0e0);
      border-radius: var(--agi-kpi-border-radius, 8px);
      background-color: var(--agi-kpi-background-color, #ffffff);
      box-shadow: var(--agi-kpi-box-shadow, 0 2px 4px rgba(0, 0, 0, 0.05));
      transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
      cursor: default;
    }

    :host([clickable]) {
      cursor: pointer;
    }

    :host([clickable]:hover) {
      transform: translateY(-2px);
      box-shadow: var(--agi-kpi-hover-box-shadow, 0 4px 8px rgba(0, 0, 0, 0.1));
    }

    .kpi-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .kpi-label {
      font-size: var(--agi-kpi-label-font-size, 0.9rem);
      color: var(--agi-kpi-label-color, #666666);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .kpi-value-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .kpi-value {
      font-size: var(--agi-kpi-value-font-size, 2.2rem);
      font-weight: var(--agi-kpi-value-font-weight, 600);
      color: var(--agi-kpi-value-color, #333333);
      line-height: 1;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .kpi-icon {
      font-size: var(--agi-kpi-icon-size, 1.5rem);
      color: var(--agi-kpi-icon-color, #007bff);
    }

    .kpi-trend {
      font-size: var(--agi-kpi-trend-font-size, 1.2rem);
      font-weight: bold;
      margin-left: 8px;
    }

    .trend-up {
      color: var(--agi-kpi-trend-up-color, #28a745); /* Vert */
    }

    .trend-down {
      color: var(--agi-kpi-trend-down-color, #dc3545); /* Rouge */
    }

    .trend-neutral {
      color: var(--agi-kpi-trend-neutral-color, #6c757d); /* Gris */
    }

    .kpi-tooltip {
      position: relative;
      display: inline-block;
    }

    .kpi-tooltip .tooltip-text {
      visibility: hidden;
      width: 120px;
      background-color: #555;
      color: #fff;
      text-align: center;
      border-radius: 6px;
      padding: 5px 0;
      position: absolute;
      z-index: 1;
      bottom: 125%; /* Position au-dessus */
      left: 50%;
      margin-left: -60px;
      opacity: 0;
      transition: opacity 0.3s;
      font-size: 0.8rem;
    }

    .kpi-tooltip:hover .tooltip-text {
      visibility: visible;
      opacity: 1;
    }
  `;

  /**
   * La valeur principale du KPI à afficher.
   * @type {string}
   */
  @property({ type: String })
  value: string = '';

  /**
   * L'étiquette ou le nom du KPI.
   * @type {string}
   */
  @property({ type: String })
  label: string = '';

  /**
   * Le nom de l'icône à afficher (facultatif).
   * Note: Ceci est un placeholder pour une icône (ex: un caractère Unicode ou une classe).
   * @type {string}
   */
  @property({ type: String })
  icon: string = '';

  /**
   * La position de l'icône par rapport à la valeur.
   * @type {IconPosition}
   */
  @property({ type: String, attribute: 'icon-position' })
  iconPosition: 'left' | 'right' = 'left';

  /**
   * La tendance du KPI, pour afficher une icône de tendance.
   * @type {Trend}
   */
  @property({ type: String })
  trend: 'up' | 'down' | 'neutral' = 'neutral';

  /**
   * Texte à afficher dans une infobulle au survol.
   * @type {string}
   */
  @property({ type: String })
  tooltip: string = '';

  /**
   * Indique si le composant est cliquable.
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true })
  clickable: boolean = false;

  /**
   * Retourne le caractère Unicode de la flèche de tendance.
   * @returns {string}
   */
  private getTrendIcon(): string {
    switch (this.trend) {
      case 'up':
        return '▲';
      case 'down':
        return '▼';
      case 'neutral':
      default:
        return '—';
    }
  }

  /**
   * Le template principal du composant.
   * @returns {import('lit').TemplateResult}
   */
  render() {
    const trendClasses = {
      'kpi-trend': true,
      'trend-up': this.trend === 'up',
      'trend-down': this.trend === 'down',
      'trend-neutral': this.trend === 'neutral',
    };

    const iconTemplate = this.icon ? html`<span class="kpi-icon">${this.icon}</span>` : null;

    const valueContent = html`
      ${this.iconPosition === 'left' ? iconTemplate : null}
      <span>${this.value}</span>
      ${this.iconPosition === 'right' ? iconTemplate : null}
    `;

    const trendTemplate = html`
      <span class=${classMap(trendClasses)} aria-label="Tendance: ${this.trend}">
        ${this.getTrendIcon()}
      </span>
    `;

    const kpiContent = html`
      <div class="kpi-label">${this.label}</div>
      <div class="kpi-value-row">
        <div class="kpi-value">${valueContent}</div>
        ${trendTemplate}
      </div>
    `;

    if (this.tooltip) {
      return html`
        <div class="kpi-tooltip">
          <div class="tooltip-text">${this.tooltip}</div>
          <div class="kpi-container">${kpiContent}</div>
        </div>
      `;
    }

    return html`<div class="kpi-container">${kpiContent}</div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-kpi': AgiKpi;
  }
}
