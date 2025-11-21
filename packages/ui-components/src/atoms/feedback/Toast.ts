import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @tag agi-progress
 * @summary Barre de progression personnalisable.
 * @category display
 * @property {number} value - La valeur actuelle de la progression (entre 0 et max).
 * @property {number} max - La valeur maximale de la progression.
 * @property {boolean} showLabel - Affiche ou masque le pourcentage de progression.
 * @property {string} color - Couleur de la barre de progression (ex: 'blue', '#007bff').
 */
@customElement('agi-progress')
export class AgiProgress extends LitElement {
  @property({ type: Number })
  value: number = 0;

  @property({ type: Number })
  max: number = 100;

  @property({ type: Boolean, attribute: 'show-label' })
  showLabel: boolean = false;

  @property({ type: String })
  color: string = 'var(--agi-progress-color, #007bff)';

  static styles = css\`
    :host {
      display: block;
      width: 100%;
      --agi-progress-height: 20px;
      --agi-progress-bg: #e9ecef;
      --agi-progress-border-radius: 0.25rem;
    }

    .progress-container {
      height: var(--agi-progress-height);
      background-color: var(--agi-progress-bg);
      border-radius: var(--agi-progress-border-radius);
      overflow: hidden;
      position: relative;
    }

    .progress-bar {
      height: 100%;
      transition: width 0.6s ease;
      border-radius: var(--agi-progress-border-radius);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      color: #fff;
      background-color: var(--agi-progress-bar-color, var(--agi-progress-color, #007bff));
    }

    .progress-label {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #333; /* Couleur du texte par défaut pour le label */
      font-weight: bold;
    }
  \`;

  private get _percentage(): number {
    // Calculer le pourcentage, en s'assurant qu'il reste entre 0 et 100
    const percentage = (this.value / this.max) * 100;
    return Math.min(100, Math.max(0, percentage));
  }

  render() {
    const percentage = this._percentage;
    const barStyle = \`width: \${percentage}%; background-color: \${this.color};\`;

    return html\`
      <div class="progress-container" role="progressbar" aria-valuenow="\${this.value}" aria-valuemin="0" aria-valuemax="\${this.max}">
        <div class="progress-bar" style="\${barStyle}">
          \${this.showLabel ? html\`<span>\${Math.round(percentage)}%</span>\` : ''}
        </div>
        \${!this.showLabel && percentage < 100 ? html\`
          <div class="progress-label">\${Math.round(percentage)}%</div>
        \` : ''}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-progress': AgiProgress;
  }
}
