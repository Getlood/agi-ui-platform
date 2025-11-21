import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Interface pour les options de la liste déroulante.
 */
export interface SelectOption {
  value: string;
  label: string;
}

/**
 * Composant Web Component Select - Liste déroulante avec options et valeur.
 *
 * @tag agi-select
 * @category form
 * @props options, value, label, disabled
 */
@customElement('agi-select')
export class AgiSelect extends LitElement {
  /**
   * Définition des styles CSS pour le composant.
   */
  static styles = css`
    :host {
      display: block;
      font-family: 'Arial', sans-serif;
      --agi-select-border-color: #ccc;
      --agi-select-focus-color: #007bff;
      --agi-select-background: #fff;
      --agi-select-text-color: #333;
      --agi-select-disabled-background: #eee;
      --agi-select-option-hover-background: #f0f0f0;
    }

    .select-container {
      position: relative;
      width: 100%;
    }

    .select-label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
      color: var(--agi-select-text-color);
    }

    .select-display {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 15px;
      border: 1px solid var(--agi-select-border-color);
      border-radius: 4px;
      background-color: var(--agi-select-background);
      color: var(--agi-select-text-color);
      cursor: pointer;
      transition: border-color 0.2s, box-shadow 0.2s;
    }

    .select-display:hover {
      border-color: var(--agi-select-focus-color);
    }

    .select-display.open {
      border-color: var(--agi-select-focus-color);
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.25);
    }

    .select-display.disabled {
      background-color: var(--agi-select-disabled-background);
      cursor: not-allowed;
      border-color: #ccc;
    }

    .arrow {
      margin-left: 10px;
      border: solid var(--agi-select-text-color);
      border-width: 0 2px 2px 0;
      display: inline-block;
      padding: 3px;
      transform: rotate(45deg);
      transition: transform 0.2s;
    }

    .select-display.open .arrow {
      transform: rotate(-135deg);
      margin-top: 5px; /* Ajustement pour la rotation */
    }

    .options-list {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      z-index: 10;
      margin-top: 5px;
      border: 1px solid var(--agi-select-border-color);
      border-radius: 4px;
      background-color: var(--agi-select-background);
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-height: 200px;
      overflow-y: auto;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .option-item {
      padding: 10px 15px;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .option-item:hover {
      background-color: var(--agi-select-option-hover-background);
    }

    .option-item.selected {
      background-color: var(--agi-select-focus-color);
      color: white;
    }
  `;

  /**
   * Liste des options disponibles pour la liste déroulante.
   */
  @property({ type: Array })
  options: SelectOption[] = [];

  /**
   * La valeur actuellement sélectionnée.
   */
  @property({ type: String })
  value: string = '';

  /**
   * Le libellé affiché au-dessus du composant.
   */
  @property({ type: String })
  label: string = '';

  /**
   * Indique si le composant est désactivé.
   */
  @property({ type: Boolean })
  disabled: boolean = false;

  /**
   * État interne pour gérer l'ouverture/fermeture de la liste.
   */
  @state()
  private _open: boolean = false;

  /**
   * Le libellé de l'option actuellement sélectionnée.
   */
  private get _selectedLabel(): string {
    const selectedOption = this.options.find(opt => opt.value === this.value);
    return selectedOption ? selectedOption.label : 'Sélectionner...';
  }

  /**
   * Bascule l'état d'ouverture de la liste.
   */
  private _toggleOpen() {
    if (!this.disabled) {
      this._open = !this._open;
    }
  }

  /**
   * Gère la sélection d'une option.
   * @param option L'option sélectionnée.
   */
  private _handleSelect(option: SelectOption) {
    if (this.value !== option.value) {
      this.value = option.value;
      this._open = false;
      
      // Émet un événement 'change' natif pour l'interopérabilité
      this.dispatchEvent(new CustomEvent('change', {
        detail: { value: this.value, option: option },
        bubbles: true,
        composed: true
      }));
    }
  }

  /**
   * Rendu de l'option individuelle.
   * @param option L'option à rendre.
   */
  private _renderOption(option: SelectOption) {
    const isSelected = this.value === option.value;
    const classes = {
      'option-item': true,
      'selected': isSelected
    };

    return html`
      <li
        class=${classMap(classes)}
        @click=${() => this._handleSelect(option)}
        role="option"
        aria-selected=${isSelected ? 'true' : 'false'}
      >
        ${option.label}
      </li>
    `;
  }

  /**
   * Rendu principal du composant.
   */
  render() {
    const displayClasses = {
      'select-display': true,
      'open': this._open,
      'disabled': this.disabled
    };

    return html`
      <div class="select-container">
        ${this.label ? html`<label class="select-label">${this.label}</label>` : ''}
        
        <div
          class=${classMap(displayClasses)}
          @click=${this._toggleOpen}
          tabindex=${this.disabled ? '-1' : '0'}
          role="combobox"
          aria-expanded=${this._open ? 'true' : 'false'}
          aria-haspopup="listbox"
          aria-controls="options-list"
          aria-disabled=${this.disabled ? 'true' : 'false'}
        >
          <span>${this._selectedLabel}</span>
          <i class="arrow"></i>
        </div>

        ${this._open && !this.disabled ? html`
          <ul class="options-list" id="options-list" role="listbox">
            ${this.options.map(this._renderOption.bind(this))}
          </ul>
        ` : ''}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-select': AgiSelect;
  }
}
