import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';

/**
 * Interface pour un élément de menu.
 */
interface MenuItem {
  label: string;
  value: string;
  disabled?: boolean;
  icon?: string;
}

/**
 * Composant Web Component pour un Menu déroulant.
 * @tag agi-menu
 * @property {boolean} open - Contrôle l'état d'ouverture du menu.
 * @property {string} label - Texte affiché sur le bouton déclencheur.
 * @property {MenuItem[]} items - Liste des éléments du menu.
 * @property {string} position - Position du menu par rapport au déclencheur (ex: 'bottom-start', 'top-end').
 */
@customElement('agi-menu')
export class AgiMenu extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      position: relative;
      --agi-menu-bg: #ffffff;
      --agi-menu-border-color: #e0e0e0;
      --agi-menu-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      --agi-menu-item-hover-bg: #f5f5f5;
      --agi-menu-item-padding: 8px 16px;
      --agi-menu-item-color: #333333;
      --agi-menu-item-disabled-color: #aaaaaa;
    }

    .trigger-button {
      padding: 10px 15px;
      border: 1px solid var(--agi-menu-border-color);
      background-color: var(--agi-menu-bg);
      cursor: pointer;
      border-radius: 4px;
      font-size: 16px;
      transition: background-color 0.2s;
    }

    .trigger-button:hover {
      background-color: var(--agi-menu-item-hover-bg);
    }

    .menu-container {
      position: absolute;
      z-index: 1000;
      min-width: 150px;
      background-color: var(--agi-menu-bg);
      border: 1px solid var(--agi-menu-border-color);
      border-radius: 4px;
      box-shadow: var(--agi-menu-shadow);
      padding: 4px 0;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: opacity 0.2s, visibility 0.2s, transform 0.2s;
    }

    .menu-container.open {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    /* Logique de positionnement simplifiée */
    .menu-container[data-position="bottom-start"] {
      top: 100%;
      left: 0;
      margin-top: 5px;
    }
    .menu-container[data-position="top-end"] {
      bottom: 100%;
      right: 0;
      margin-bottom: 5px;
    }

    .menu-item {
      display: flex;
      align-items: center;
      padding: var(--agi-menu-item-padding);
      color: var(--agi-menu-item-color);
      cursor: pointer;
      font-size: 14px;
    }

    .menu-item:hover:not(.disabled) {
      background-color: var(--agi-menu-item-hover-bg);
    }

    .menu-item.disabled {
      color: var(--agi-menu-item-disabled-color);
      cursor: not-allowed;
    }

    .menu-item .icon {
      margin-right: 8px;
      /* Placeholder pour l'icône */
    }
  `;

  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  @property({ type: String })
  label: string = 'Options';

  @property({ type: Array })
  items: MenuItem[] = [];

  @property({ type: String })
  position: 'bottom-start' | 'top-end' = 'bottom-start';

  private _handleTriggerClick() {
    this.open = !this.open;
  }

  private _handleItemClick(item: MenuItem) {
    if (item.disabled) return;

    /**
     * Événement émis lorsqu'un élément du menu est sélectionné.
     * @event agi-menu-select
     * @type {object}
     * @property {string} value - La valeur de l'élément sélectionné.
     * @property {string} label - Le label de l'élément sélectionné.
     */
    this.dispatchEvent(new CustomEvent('agi-menu-select', {
      detail: { value: item.value, label: item.label },
      bubbles: true,
      composed: true,
    }));

    this.open = false; // Fermer le menu après la sélection
  }

  private _handleOutsideClick = (event: MouseEvent) => {
    if (this.open && !event.composedPath().includes(this)) {
      this.open = false;
    }
  };

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
  }

  protected render() {
    const menuClasses = {
      'menu-container': true,
      'open': this.open,
    };

    return html`
      <button class="trigger-button" @click=${this._handleTriggerClick} aria-expanded=${this.open} aria-haspopup="true">
        ${this.label}
      </button>

      <div class=${classMap(menuClasses)} data-position=${this.position} role="menu">
        ${this.items.map(item => html`
          <div
            class=${classMap({ 'menu-item': true, 'disabled': !!item.disabled })}
            role="menuitem"
            tabindex=${item.disabled ? -1 : 0}
            @click=${() => this._handleItemClick(item)}
            @keydown=${(e: KeyboardEvent) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this._handleItemClick(item);
              }
            }}
          >
            ${item.icon ? html`<span class="icon">${item.icon}</span>` : ''}
            ${item.label}
          </div>
        `)}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-menu': AgiMenu;
  }
}
