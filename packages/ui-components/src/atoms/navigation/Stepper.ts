import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';

/**
 * Interface pour définir une étape du Stepper.
 */
export interface Step {
  id: string;
  label: string;
  description?: string;
}

/**
 * Composant Web Component Stepper (Étapes)
 * 
 * @tag agi-stepper
 * @category navigation
 * @props_count 2
 */
@customElement('agi-stepper')
export class AgiStepper extends LitElement {

  /**
   * Liste des étapes à afficher.
   */
  @property({ type: Array })
  steps: Step[] = [];

  /**
   * L'identifiant (id) de l'étape actuellement active.
   */
  @property({ type: String })
  current: string = '';

  // Métadonnées VLA (simulées par des propriétés statiques)
  static readonly is = 'agi-stepper';
  static readonly category = 'navigation';
  static readonly propsCount = 2;

  static styles = css`
    /* Les styles seront ajoutés dans la Phase 3 */
    :host {
      display: block;
      font-family: sans-serif;
    }

    .stepper {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding: 20px 0;
    }

    .step {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      position: relative;
      text-align: center;
    }

    .step-indicator {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background-color: #ccc;
      color: white;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      z-index: 1;
      transition: background-color 0.3s, border-color 0.3s;
    }

    .step-label {
      margin-top: 8px;
      font-size: 0.9em;
      color: #555;
      transition: color 0.3s;
    }

    .step-line {
      position: absolute;
      top: 15px; /* Moitié de la hauteur de step-indicator */
      left: 50%;
      right: -50%;
      height: 2px;
      background-color: #ccc;
      z-index: 0;
      transform: translateX(0%);
      transition: background-color 0.3s;
    }

    .step:last-child .step-line {
      display: none;
    }

    /* Styles pour les étapes actives et complétées */
    .step.completed .step-indicator {
      background-color: #4CAF50; /* Vert pour complété */
    }

    .step.completed .step-line {
      background-color: #4CAF50;
    }

    .step.active .step-indicator {
      background-color: #2196F3; /* Bleu pour actif */
      border: 2px solid #2196F3;
      box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.3);
    }

    .step.active .step-label {
      color: #2196F3;
      font-weight: bold;
    }
  `;

  private _getStepClass(step: Step, index: number): string {
    const currentIndex = this.steps.findIndex(s => s.id === this.current);
    let classes = 'step';
    
    if (index < currentIndex) {
      classes += ' completed';
    } else if (index === currentIndex) {
      classes += ' active';
    }

    return classes;
  }

  render() {
    return html`
      <div class="stepper">
        ${this.steps.map((step, index) => html`
          <div class="${this._getStepClass(step, index)}">
            <div class="step-indicator">
              ${index < this.steps.findIndex(s => s.id === this.current) ? html`&#10003;` : index + 1}
            </div>
            <div class="step-label">${step.label}</div>
            ${index < this.steps.length - 1 ? html`<div class="step-line"></div>` : ''}
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-stepper': AgiStepper;
  }
}
