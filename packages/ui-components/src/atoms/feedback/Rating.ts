import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * @typedef {Object} ToggleOption
 * @property {string} value - La valeur unique de l'option.
 * @property {string} label - Le texte affiché pour l'option.
 * @property {boolean} [disabled=false] - Indique si l'option est désactivée.
 */
export interface ToggleOption {
  value: string;
  label: string;
  disabled?: boolean;
}

/**
 * @fires change - Déclenché lorsque la valeur sélectionnée change. Le detail contient la nouvelle valeur (string | string[]).
 * @fires input - Déclenché lorsque la valeur sélectionnée change (alias de 'change').
 *
 * @slot - Contenu par défaut (non utilisé dans cette implémentation basée sur `options`).
 */
@customElement('agi-toggle-group')
export class AgiToggleGroup extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      border-radius: 4px;
      padding: 2px;
      background-color: var(--agi-toggle-group-background, #f0f0f0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .toggle-button {
      padding: 8px 16px;
      margin: 0 2px;
      border: none;
      background-color: transparent;
      color: var(--agi-toggle-group-text-color, #333);
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      transition: background-color 0.2s, color 0.2s, box-shadow 0.2s;
      border-radius: 3px;
      user-select: none;
      flex-grow: 1;
      text-align: center;
    }

    .toggle-button:first-child {
      margin-left: 0;
    }

    .toggle-button:last-child {
      margin-right: 0;
    }

    .toggle-button:hover:not(.selected):not([disabled]) {
      background-color: var(--agi-toggle-group-hover-background, #e0e0e0);
    }

    .toggle-button.selected {
      background-color: var(--agi-toggle-group-selected-background, #007bff);
      color: var(--agi-toggle-group-selected-text-color, #fff);
      box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);
    }

    .toggle-button[disabled] {
      cursor: not-allowed;
      opacity: 0.5;
    }

    :host([disabled]) .toggle-button {
      cursor: not-allowed;
      opacity: 0.6;
    }
  `;

  /**
   * Les options disponibles pour le groupe de toggles.
   */
  @property({ type: Array })
  options: ToggleOption[] = [];

  /**
   * Le mode de sélection : 'single' pour une seule sélection (par défaut), 'multiple' pour plusieurs.
   */
  @property({ type: String })
  mode: 'single' | 'multiple' = 'single';

  /**
   * La valeur actuellement sélectionnée. Peut être une chaîne (mode 'single') ou un tableau de chaînes (mode 'multiple').
   */
  @property({ attribute: false })
  value: string | string[] | null = null;

  /**
   * Désactive tous les toggles du groupe.
   */
  @property({ type: Boolean, reflect: true })
  disabled: boolean = false;

  /**
   * Le nom du groupe, utilisé pour l'accessibilité et la soumission de formulaire (si implémenté).
   */
  @property({ type: String })
  name: string = '';

  /**
   * Indique si le groupe est requis.
   */
  @property({ type: Boolean })
  required: boolean = false;

  /**
   * Gère l'état interne de la valeur pour faciliter le rendu.
   */
  @state()
  private _internalValue: Set<string> = new Set();

  protected willUpdate(changedProperties: PropertyValues): void {
    if (changedProperties.has('value')) {
      this._updateInternalValue(this.value);
    }
  }

  private _updateInternalValue(newValue: string | string[] | null): void {
    const newSet = new Set<string>();
    if (newValue) {
      if (Array.isArray(newValue)) {
        newValue.forEach(v => newSet.add(v));
      } else {
        newSet.add(newValue);
      }
    }
    this._internalValue = newSet;
  }

  private _handleToggle(optionValue: string): void {
    if (this.disabled) return;

    const isSelected = this._internalValue.has(optionValue);
    const newSet = new Set(this._internalValue);

    if (this.mode === 'single') {
      if (isSelected) {
        // Dans le mode 'single', on ne peut pas désélectionner si c'est le seul élément sélectionné
        // ou si le composant n'est pas requis. Pour l'instant, on permet la désélection si ce n'est pas requis.
        if (this.required && newSet.size === 1) {
            return; // Empêche la désélection si requis et un seul élément sélectionné
        }
        newSet.clear();
      } else {
        newSet.clear();
        newSet.add(optionValue);
      }
    } else { // mode 'multiple'
      if (isSelected) {
        newSet.delete(optionValue);
      } else {
        newSet.add(optionValue);
      }
    }

    // Mise à jour de la propriété `value` publique
    let newValue: string | string[] | null;
    if (this.mode === 'single') {
      newValue = newSet.size > 0 ? Array.from(newSet)[0] : null;
    } else {
      newValue = Array.from(newSet);
    }

    // Empêcher la désélection si requis et le nouveau jeu est vide
    if (this.required && newSet.size === 0) {
        return;
    }

    this.value = newValue;
    this._internalValue = newSet; // Force la mise à jour du state pour le rendu

    this._dispatchChange(newValue);
  }

  private _dispatchChange(newValue: string | string[] | null): void {
    this.dispatchEvent(new CustomEvent('change', {
      detail: newValue,
      bubbles: true,
      composed: true
    }));
    this.dispatchEvent(new CustomEvent('input', {
      detail: newValue,
      bubbles: true,
      composed: true
    }));
  }

  protected render() {
    return html`
      ${this.options.map(option => {
        const isSelected = this._internalValue.has(option.value);
        const isDisabled = this.disabled || option.disabled;
        const classes = {
          'toggle-button': true,
          'selected': isSelected,
        };

        return html`
          <button
            class=${classMap(classes)}
            @click=${() => this._handleToggle(option.value)}
            ?disabled=${isDisabled}
            role="${this.mode === 'single' ? 'radio' : 'checkbox'}"
            aria-checked="${isSelected}"
            aria-label="${option.label}"
            value="${option.value}"
          >
            ${option.label}
          </button>
        `;
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-toggle-group': AgiToggleGroup;
  }
}
