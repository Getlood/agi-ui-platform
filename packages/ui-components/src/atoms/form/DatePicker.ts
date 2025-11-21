import { html, css, LitElement } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * @typedef {'12h' | '24h'} TimeFormat
 */

/**
 * Composant Web Component pour la sélection d'heure (TimePicker).
 *
 * @fires change - Événement émis lorsque la valeur de l'heure change.
 * @fires input - Événement émis lors de la saisie de l'heure.
 */
@customElement('agi-time-picker')
export class AgiTimePicker extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      --agi-time-picker-border-color: #ccc;
      --agi-time-picker-focus-color: #007bff;
      --agi-time-picker-disabled-bg: #eee;
      --agi-time-picker-disabled-color: #999;
    }

    .time-picker-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }

    .label {
      font-size: 0.9rem;
      color: #333;
      cursor: default;
    }

    .input-group {
      display: flex;
      border: 1px solid var(--agi-time-picker-border-color);
      border-radius: 4px;
      overflow: hidden;
      transition: border-color 0.2s;
    }

    .input-group:focus-within {
      border-color: var(--agi-time-picker-focus-color);
      box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
    }

    input {
      flex-grow: 1;
      padding: 8px 12px;
      border: none;
      outline: none;
      font-size: 1rem;
      text-align: center;
      min-width: 0; /* Permet la réduction de la taille */
    }

    .separator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 4px;
      font-size: 1rem;
      color: #555;
    }

    .ampm-select {
      padding: 8px 12px;
      border: none;
      border-left: 1px solid var(--agi-time-picker-border-color);
      background-color: #f8f8f8;
      cursor: pointer;
      outline: none;
      font-size: 1rem;
    }

    .ampm-select:focus {
      outline: 2px solid var(--agi-time-picker-focus-color);
      outline-offset: -2px;
    }

    .disabled .input-group {
      background-color: var(--agi-time-picker-disabled-bg);
      border-color: #ddd;
    }

    .disabled input,
    .disabled .ampm-select {
      background-color: var(--agi-time-picker-disabled-bg);
      color: var(--agi-time-picker-disabled-color);
      cursor: not-allowed;
    }

    .disabled .ampm-select {
      border-left-color: #ddd;
    }
  `;

  /**
   * La valeur de l'heure sélectionnée au format 'HH:mm' (24h).
   * @type {string}
   */
  @property({ type: String })
  value: string = '00:00';

  /**
   * Le format d'affichage de l'heure ('12h' ou '24h').
   * @type {TimeFormat}
   */
  @property({ type: String })
  format: '12h' | '24h' = '24h';

  /**
   * Indique si le sélecteur d'heure est désactivé.
   * @type {boolean}
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * Le libellé associé au sélecteur d'heure.
   * @type {string}
   */
  @property({ type: String })
  label: string = '';

  /**
   * L'intervalle de minutes pour la sélection (par exemple, 5, 10, 15).
   * @type {number}
   */
  @property({ type: Number })
  step: number = 1;

  private _hours: string = '00';
  private _minutes: string = '00';
  private _ampm: 'AM' | 'PM' = 'AM';

  connectedCallback() {
    super.connectedCallback();
    this._parseValue(this.value);
  }

  willUpdate(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('value')) {
      this._parseValue(this.value);
    }
  }

  /**
   * Analyse la propriété `value` et met à jour les états internes (_hours, _minutes, _ampm).
   * @param {string} newValue - La nouvelle valeur de l'heure au format 'HH:mm'.
   */
  private _parseValue(newValue: string) {
    const [h, m] = newValue.split(':').map(s => s.padStart(2, '0'));
    let hours = parseInt(h, 10);
    let minutes = parseInt(m, 10);

    if (isNaN(hours) || hours < 0 || hours > 23) hours = 0;
    if (isNaN(minutes) || minutes < 0 || minutes > 59) minutes = 0;

    this._minutes = minutes.toString().padStart(2, '0');

    if (this.format === '12h') {
      this._ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours === 0 ? 12 : hours; // 0h ou 12h devient 12
    }

    this._hours = hours.toString().padStart(2, '0');
  }

  /**
   * Met à jour la propriété `value` et émet les événements 'input' et 'change'.
   */
  private _updateValue() {
    let hours24 = parseInt(this._hours, 10);
    const minutes = parseInt(this._minutes, 10);

    if (this.format === '12h') {
      if (this._ampm === 'PM' && hours24 !== 12) {
        hours24 += 12;
      } else if (this._ampm === 'AM' && hours24 === 12) {
        hours24 = 0;
      }
    }

    const newHours = hours24.toString().padStart(2, '0');
    const newMinutes = minutes.toString().padStart(2, '0');
    const newValue = `${newHours}:${newMinutes}`;

    if (this.value !== newValue) {
      this.value = newValue;
      this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value } }));
      this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value } }));
    }
  }

  /**
   * Gère la saisie des heures.
   * @param {Event} e - L'événement de saisie.
   */
  private _handleHoursInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let hours = parseInt(input.value, 10);

    if (isNaN(hours)) {
      this._hours = '00';
      input.value = '00';
      return;
    }

    const maxHours = this.format === '12h' ? 12 : 23;
    const minHours = this.format === '12h' ? 1 : 0;

    if (hours > maxHours) {
      hours = maxHours;
    } else if (hours < minHours) {
      hours = minHours;
    }

    this._hours = hours.toString().padStart(2, '0');
    input.value = this._hours;
    this._updateValue();
  }

  /**
   * Gère la saisie des minutes.
   * @param {Event} e - L'événement de saisie.
   */
  private _handleMinutesInput(e: Event) {
    const input = e.target as HTMLInputElement;
    let minutes = parseInt(input.value, 10);

    if (isNaN(minutes)) {
      this._minutes = '00';
      input.value = '00';
      return;
    }

    if (minutes > 59) {
      minutes = 59;
    } else if (minutes < 0) {
      minutes = 0;
    }

    // Appliquer le pas (step)
    const step = this.step > 0 ? this.step : 1;
    minutes = Math.round(minutes / step) * step;
    if (minutes > 59) minutes = 0; // Gérer le dépassement après l'arrondi

    this._minutes = minutes.toString().padStart(2, '0');
    input.value = this._minutes;
    this._updateValue();
  }

  /**
   * Gère le changement de AM/PM.
   * @param {Event} e - L'événement de changement.
   */
  private _handleAmPmChange(e: Event) {
    const select = e.target as HTMLSelectElement;
    this._ampm = select.value as 'AM' | 'PM';
    this._updateValue();
  }

  render() {
    const classes = {
      'time-picker-container': true,
      'disabled': this.disabled,
    };

    return html`
      <div class=${classMap(classes)}>
        ${this.label ? html`<label class="label">${this.label}</label>` : ''}
        <div class="input-group">
          <input
            type="number"
            class="hours-input"
            .value=${this._hours}
            @change=${this._handleHoursInput}
            min=${this.format === '12h' ? 1 : 0}
            max=${this.format === '12h' ? 12 : 23}
            ?disabled=${this.disabled}
            aria-label="Heures"
          />
          <span class="separator">:</span>
          <input
            type="number"
            class="minutes-input"
            .value=${this._minutes}
            @change=${this._handleMinutesInput}
            min="0"
            max="59"
            step=${this.step}
            ?disabled=${this.disabled}
            aria-label="Minutes"
          />
          ${this.format === '12h'
            ? html`
                <select
                  class="ampm-select"
                  .value=${this._ampm}
                  @change=${this._handleAmPmChange}
                  ?disabled=${this.disabled}
                  aria-label="AM ou PM"
                >
                  <option value="AM">AM</option>
                  <option value="PM">PM</option>
                </select>
              `
            : ''}
        </div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-time-picker': AgiTimePicker;
  }
}
