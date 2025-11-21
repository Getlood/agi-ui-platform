import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @fileoverview Composant Web Component Slider (Curseur) basé sur Lit Element.
 * @tag agi-slider
 * @category form
 * @props min, max, step, value
 */
@customElement('agi-slider')
export class AgiSlider extends LitElement {
  /**
   * La valeur minimale du curseur.
   */
  @property({ type: Number })
  min: number = 0;

  /**
   * La valeur maximale du curseur.
   */
  @property({ type: Number })
  max: number = 100;

  /**
   * Le pas d'incrémentation du curseur.
   */
  @property({ type: Number })
  step: number = 1;

  /**
   * La valeur actuelle du curseur.
   */
  @property({ type: Number })
  value: number = 50;

  static styles = css`
    :host {
      display: block;
      width: 100%;
      --slider-height: 8px;
      --track-color: #e0e0e0;
      --progress-color: #007bff;
      --thumb-color: #007bff;
      --thumb-size: 16px;
    }

    .slider-container {
      position: relative;
      height: var(--thumb-size);
      display: flex;
      align-items: center;
      padding: calc(var(--thumb-size) / 2) 0;
    }

    input[type="range"] {
      -webkit-appearance: none;
      width: 100%;
      height: var(--slider-height);
      background: transparent;
      margin: 0;
      cursor: pointer;
      position: absolute;
      z-index: 2;
    }

    /* Track styles */
    input[type="range"]::-webkit-slider-runnable-track {
      width: 100%;
      height: var(--slider-height);
      background: var(--track-color);
      border-radius: 4px;
    }

    input[type="range"]::-moz-range-track {
      width: 100%;
      height: var(--slider-height);
      background: var(--track-color);
      border-radius: 4px;
    }

    /* Thumb styles */
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: var(--thumb-size);
      width: var(--thumb-size);
      border-radius: 50%;
      background: var(--thumb-color);
      cursor: pointer;
      margin-top: calc((var(--slider-height) - var(--thumb-size)) / 2);
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
      z-index: 3;
      position: relative;
    }

    input[type="range"]::-moz-range-thumb {
      height: var(--thumb-size);
      width: var(--thumb-size);
      border-radius: 50%;
      background: var(--thumb-color);
      cursor: pointer;
      border: none;
      box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);
    }

    /* Progress bar overlay */
    .progress-bar {
      position: absolute;
      height: var(--slider-height);
      background: var(--progress-color);
      border-radius: 4px;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      z-index: 1;
      pointer-events: none; /* Important to allow interaction with the range input */
    }
  `;

  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.value = parseFloat(input.value);
    this._dispatchChangeEvent();
  }

  private _dispatchChangeEvent() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true
    }));
  }

  private _getProgressWidth(): string {
    const percentage = ((this.value - this.min) / (this.max - this.min)) * 100;
    return `${percentage}%`;
  }

  render() {
    return html`
      <div class="slider-container">
        <div class="progress-bar" style="width: ${this._getProgressWidth()};"></div>
        <input
          type="range"
          .min=${this.min.toString()}
          .max=${this.max.toString()}
          .step=${this.step.toString()}
          .value=${this.value.toString()}
          @input=${this._handleInput}
        />
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-slider': AgiSlider;
  }
}
