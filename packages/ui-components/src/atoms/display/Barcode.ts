import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @typedef {Object} CounterMetadata
 * @property {string} component_name - Nom du composant.
 * @property {string} tag_name - Tag HTML du composant.
 * @property {string} category - Catégorie du composant (form/feedback/display/navigation).
 * @property {number} props_count - Nombre de propriétés du composant.
 */

/**
 * Métadonnées pour VLA (Visual Library Analyzer)
 * @type {CounterMetadata}
 */
export const componentMetadata = {
  component_name: 'Counter',
  tag_name: 'agi-counter',
  category: 'display',
  props_count: 3, // startValue, endValue, duration
};

/**
 * Composant Web Component de compteur animé.
 *
 * @slot - Contenu par défaut (non utilisé ici, mais bonne pratique).
 * @csspart counter-value - La valeur numérique du compteur.
 */
@customElement(componentMetadata.tag_name)
export class AgiCounter extends LitElement {
  /**
   * La valeur de départ du compteur.
   */
  @property({ type: Number, attribute: 'start-value' })
  startValue: number = 0;

  /**
   * La valeur cible du compteur.
   */
  @property({ type: Number, attribute: 'end-value' })
  endValue: number = 100;

  /**
   * La durée de l'animation en millisecondes.
   */
  @property({ type: Number })
  duration: number = 2000;

  /**
   * L'état interne pour la valeur actuelle affichée.
   */
  @state()
  private currentValue: number = this.startValue;

  static styles = css\`
    :host {
      display: inline-block;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      background-color: #f9f9f9;
      padding: 10px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: box-shadow 0.3s ease;
    }

    :host(:hover) {
      box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
    }

    .counter-container {
      text-align: center;
    }

    .counter-value {
      font-size: 2.5em;
      font-weight: 700;
      color: #007bff; /* Couleur primaire */
      display: block;
      line-height: 1.2;
      /* Utilisation de la propriété CSS part pour le ciblage externe */
      ::part(counter-value) {
        /* Les styles ici seront appliqués à l'élément avec part="counter-value" */
      }
    }
  \`;

  // Méthode pour l'animation
  private animateCounter() {
    const startTime = performance.now();
    const range = this.endValue - this.startValue;

    const step = (timestamp: number) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / this.duration, 1);
      
      // Utilisation d'une fonction d'accélération (ease-out quad) pour un effet plus agréable
      const easedProgress = progress * (2 - progress); 

      this.currentValue = Math.floor(this.startValue + easedProgress * range);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        this.currentValue = this.endValue; // Assurer que la valeur finale est exacte
      }
    };

    requestAnimationFrame(step);
  }

  // Déclencher l'animation lorsque le composant est connecté au DOM
  connectedCallback() {
    super.connectedCallback();
    // Réinitialiser la valeur de départ avant de commencer l'animation
    this.currentValue = this.startValue; 
    this.animateCounter();
  }

  // Déclencher l'animation à nouveau si les propriétés changent
  protected updated(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('startValue') || changedProperties.has('endValue') || changedProperties.has('duration')) {
      this.animateCounter();
    }
  }

  render() {
    return html\`
      <div class="counter-container">
        <span part="counter-value" class="counter-value">\${this.currentValue.toLocaleString()}</span>
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-counter': AgiCounter;
  }
}
