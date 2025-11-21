import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * @typedef {Object} DatepickerChangeEventDetail
 * @property {string} value - La date sélectionnée au format string (formaté selon la prop 'format').
 * @property {Date | null} date - L'objet Date sélectionné, ou null si non valide.
 */

/**
 * @fires {CustomEvent<DatepickerChangeEventDetail>} change - Déclenché lorsque la date sélectionnée change.
 */
@customElement('agi-datepicker')
export class AgiDatepicker extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
      --agi-datepicker-primary-color: #007bff;
      --agi-datepicker-border-color: #ccc;
      --agi-datepicker-background-color: #fff;
      --agi-datepicker-hover-color: #f0f0f0;
      --agi-datepicker-selected-color: #fff;
      --agi-datepicker-selected-bg: var(--agi-datepicker-primary-color);
    }

    .datepicker-container {
      position: relative;
      display: inline-block;
    }

    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: #333;
    }

    input {
      padding: 10px;
      border: 1px solid var(--agi-datepicker-border-color);
      border-radius: 4px;
      font-size: 16px;
      width: 200px;
      box-sizing: border-box;
      cursor: pointer;
    }

    input:focus {
      outline: none;
      border-color: var(--agi-datepicker-primary-color);
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }

    input:disabled {
      background-color: #eee;
      cursor: not-allowed;
    }

    .calendar-popup {
      position: absolute;
      z-index: 10;
      background-color: var(--agi-datepicker-background-color);
      border: 1px solid var(--agi-datepicker-border-color);
      border-radius: 4px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
      padding: 10px;
      margin-top: 5px;
      width: 300px;
    }

    .calendar-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
    }

    .month-year {
      font-weight: bold;
      font-size: 1.1em;
    }

    .nav-button {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.2em;
      padding: 5px 10px;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .nav-button:hover {
      background-color: var(--agi-datepicker-hover-color);
    }

    .calendar-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 5px;
      text-align: center;
    }

    .day-name {
      font-weight: bold;
      color: #777;
      padding: 5px 0;
    }

    .day {
      background: none;
      border: none;
      padding: 8px;
      cursor: pointer;
      border-radius: 4px;
      transition: background-color 0.2s, color 0.2s;
      font-size: 0.9em;
    }

    .day:hover:not(.empty):not(.disabled) {
      background-color: var(--agi-datepicker-hover-color);
    }

    .day.today {
      border: 1px solid var(--agi-datepicker-primary-color);
    }

    .day.selected {
      background-color: var(--agi-datepicker-selected-bg);
      color: var(--agi-datepicker-selected-color);
      font-weight: bold;
    }

    .day.selected:hover {
      background-color: var(--agi-datepicker-selected-bg);
    }

    .day.empty {
      visibility: hidden;
    }

    .day.disabled {
      color: #aaa;
      cursor: not-allowed;
      text-decoration: line-through;
    }
  `}],path:
  `;

  /**
   * La date sélectionnée au format 'YYYY-MM-DD' (valeur interne).
   */
  @property({ type: String })
  value: string = '';

  /**
   * Le format d'affichage de la date. Supporte 'YYYY-MM-DD', 'DD/MM/YYYY', 'MM/DD/YYYY'.
   */
  @property({ type: String })
  format: string = 'YYYY-MM-DD';

  /**
   * Le libellé du sélecteur de date.
   */
  @property({ type: String })
  label: string = 'Sélectionner une date';

  /**
   * La date minimale sélectionnable au format 'YYYY-MM-DD'.
   */
  @property({ type: String, attribute: 'min-date' })
  minDate: string = '';

  /**
   * La date maximale sélectionnable au format 'YYYY-MM-DD'.
   */
  @property({ type: String, attribute: 'max-date' })
  maxDate: string = '';

  /**
   * Désactive le sélecteur de date.
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * Indique si le calendrier est ouvert.
   */
  @state()
  private _isOpen: boolean = false;

  /**
   * Le mois actuellement affiché dans le calendrier (0-11).
   */
  @state()
  private _currentMonth: number = new Date().getMonth();

  /**
   * L'année actuellement affichée dans le calendrier.
   */
  @state()
  private _currentYear: number = new Date().getFullYear();

  private _selectedDate: Date | null = null;
  private _inputElement: HTMLInputElement | null = null;

  private readonly _MONTH_NAMES = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];
  private readonly _DAY_NAMES = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  connectedCallback() {
    super.connectedCallback();
    this._selectedDate = this._parseDate(this.value);
    document.addEventListener('click', this._handleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
  }

  updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('value')) {
      this._selectedDate = this._parseDate(this.value);
      if (this._selectedDate) {
        this._currentMonth = this._selectedDate.getMonth();
        this._currentYear = this._selectedDate.getFullYear();
      }
    }
  }

  private _handleOutsideClick = (e: Event) => {
    if (this._isOpen && !e.composedPath().includes(this)) {
      this._isOpen = false;
    }
  };

  private _parseDate(dateString: string): Date | null {
    if (!dateString) return null;

    const parts = dateString.split(/[-\/]/).map(p => parseInt(p, 10));
    let year, month, day;

    switch (this.format) {
      case 'DD/MM/YYYY':
        [day, month, year] = parts;
        break;
      case 'MM/DD/YYYY':
        [month, day, year] = parts;
        break;
      case 'YYYY-MM-DD':
      default:
        [year, month, day] = parts;
        break;
    }

    if (year && month && day) {
      const date = new Date(year, month - 1, day);
      // Simple validation to check if the date parts match the created date
      if (date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day) {
        return date;
      }
    }
    return null;
  }

  private _formatDate(date: Date, format: string): string {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');

    switch (format) {
      case 'DD/MM/YYYY':
        return `${d}/${m}/${y}`;
      case 'MM/DD/YYYY':
        return `${m}/${d}/${y}`;
      case 'YYYY-MM-DD':
      default:
        return `${y}-${m}-${d}`;
    }
  }

  private _dispatchChange(value: string, date: Date | null) {
    const detail = { value, date };
    this.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }));
  }

  private _openCalendar() {
    if (!this.disabled) {
      this._isOpen = true;
      // Synchroniser le calendrier avec la date actuelle si aucune n'est sélectionnée
      if (!this._selectedDate) {
        const today = new Date();
        this._currentMonth = today.getMonth();
        this._currentYear = today.getFullYear();
      }
    }
  }

  private _handleInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const inputValue = input.value;
    const parsedDate = this._parseDate(inputValue);

    this.value = inputValue; // Mise à jour de la prop value
    this._selectedDate = parsedDate;

    if (parsedDate) {
      this._currentMonth = parsedDate.getMonth();
      this._currentYear = parsedDate.getFullYear();
    }

    this._dispatchChange(inputValue, parsedDate);
  }

  private _handleDateClick(day: number) {
    const newDate = new Date(this._currentYear, this._currentMonth, day);
    const formattedValue = this._formatDate(newDate, this.format);

    this.value = formattedValue;
    this._selectedDate = newDate;
    this._isOpen = false;

    this._dispatchChange(formattedValue, newDate);
  }

  private _changeMonth(delta: number) {
    let newMonth = this._currentMonth + delta;
    let newYear = this._currentYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    } else if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    }

    this._currentMonth = newMonth;
    this._currentYear = newYear;
  }

  private _isDateDisabled(date: Date): boolean {
    const min = this._parseDate(this.minDate);
    const max = this._parseDate(this.maxDate);
    const time = date.getTime();

    if (min && time < min.getTime()) return true;
    if (max && time > max.getTime()) return true;

    return false;
  }

  private _getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
  }

  private _renderCalendar() {
    const daysInMonth = this._getDaysInMonth(this._currentYear, this._currentMonth);
    const firstDayOfMonth = new Date(this._currentYear, this._currentMonth, 1).getDay(); // 0=Dimanche, 1=Lundi...
    const startDay = (firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1); // 0=Lundi, 6=Dimanche

    const days = [];
    // Jours du mois précédent pour le décalage
    for (let i = 0; i < startDay; i++) {
      days.push(html`<div class="day empty"></div>`);
    }

    // Jours du mois actuel
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(this._currentYear, this._currentMonth, day);
      const isToday = date.toDateString() === new Date().toDateString();
      const isSelected = this._selectedDate && date.toDateString() === this._selectedDate.toDateString();
      const isDisabled = this._isDateDisabled(date);

      const classes = {
        day: true,
        today: isToday,
        selected: isSelected,
        disabled: isDisabled,
      };

      days.push(html`
        <button
          class=${classMap(classes)}
          @click=${() => this._handleDateClick(day)}
          ?disabled=${isDisabled}
        >
          ${day}
        </button>
      `);
    }

    return html`
      <div class="calendar-popup">
        <div class="calendar-header">
          <button class="nav-button prev" @click=${() => this._changeMonth(-1)}>&lt;</button>
          <div class="month-year">
            ${this._MONTH_NAMES[this._currentMonth]} ${this._currentYear}
          </div>
          <button class="nav-button next" @click=${() => this._changeMonth(1)}>&gt;</button>
        </div>
        <div class="calendar-grid">
          ${this._DAY_NAMES.map(day => html`<div class="day-name">${day}</div>`)}
          ${days}
        </div>
      </div>
    `;
  }

  render() {
    return html`
      <div class="datepicker-container">
        <label for="date-input">${this.label}</label>
        <input
          id="date-input"
          type="text"
          .value=${this.value}
          @focus=${this._openCalendar}
          @input=${this._handleInput}
          ?disabled=${this.disabled}
          placeholder="${this.format}"
          @click=${this._openCalendar}
          @keydown=${(e: KeyboardEvent) => { if (e.key === 'Enter') this._isOpen = false; }}
          @blur=${(e: FocusEvent) => {
            // Nécessaire pour s'assurer que le calendrier se ferme si l'utilisateur ne clique pas sur un jour
            setTimeout(() => {
              const relatedTarget = e.relatedTarget as HTMLElement;
              if (!relatedTarget || !this.shadowRoot?.contains(relatedTarget)) {
                this._isOpen = false;
              }
            }, 100);
          }}
        />
        ${this._isOpen ? this._renderCalendar() : ''}
      </div>
    `;
  }
}
