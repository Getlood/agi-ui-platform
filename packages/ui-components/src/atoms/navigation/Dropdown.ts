import { LitElement, html, css } from 'lit';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

/**
 * @tag agi-accordion-item
 * @summary Un élément individuel dans un composant agi-accordion.
 * @category display
 * @property {boolean} open - Indique si l'élément est ouvert ou fermé.
 * @csspart header - Le conteneur de l'en-tête de l'élément.
 * @csspart content - Le conteneur du contenu de l'élément.
 * @event agi-accordion-item-toggle - Événement émis lorsque l'état ouvert/fermé de l'élément change.
 */
@customElement('agi-accordion-item')
export class AccordionItem extends LitElement {
  static styles = css`
    :host {
      display: block;
      border-bottom: 1px solid var(--agi-accordion-item-border-color, #eee);
    }

    :host(:last-child) {
      border-bottom: none;
    }

    .header {
      padding: 15px;
      cursor: pointer;
      background-color: var(--agi-accordion-item-header-bg, #f9f9f9);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header:hover {
      background-color: var(--agi-accordion-item-header-hover-bg, #f0f0f0);
    }

    .content {
      padding: 15px;
      border-top: 1px solid var(--agi-accordion-item-content-border-color, #eee);
      display: none;
      overflow: hidden; /* Assure que le contenu ne déborde pas */
    }

    :host([open]) .content {
      display: block;
    }

    .icon {
      transition: transform 0.3s ease;
      font-weight: bold;
    }

    :host([open]) .icon {
      transform: rotate(180deg);
    }
  `;

  /**
   * Indique si l'élément est ouvert ou fermé.
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * Bascule l'état ouvert/fermé de l'élément.
   */
  private _toggleOpen() {
    this.open = !this.open;
    /**
     * Événement émis lorsque l'état ouvert/fermé de l'élément change.
     */
    this.dispatchEvent(new CustomEvent('agi-accordion-item-toggle', {
      bubbles: true,
      composed: true,
      detail: { open: this.open }
    }));
  }

  render() {
    return html`
      <div class="header" part="header" @click=${this._toggleOpen}>
        <slot name="header"></slot>
        <span class="icon">${this.open ? '▲' : '▼'}</span>
      </div>
      <div class="content" part="content">
        <slot></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-accordion-item': AccordionItem;
  }
}

/**
 * @tag agi-accordion
 * @summary Un composant accordéon qui gère l'état de ses éléments enfants.
 * @category display
 * @property {boolean} multiple - Permet d'ouvrir plusieurs éléments à la fois.
 * @csspart container - Le conteneur principal de l'accordéon.
 */
@customElement('agi-accordion')
export class AgiAccordion extends LitElement {
  static styles = css`
    :host {
      display: block;
      border: 1px solid var(--agi-accordion-border-color, #ccc);
      border-radius: 4px;
    }

    .container {
      display: flex;
      flex-direction: column;
    }
  `;

  /**
   * Si vrai, plusieurs éléments de l'accordéon peuvent être ouverts simultanément.
   */
  @property({ type: Boolean, reflect: true })
  multiple = false;

  /**
   * Référence aux éléments enfants agi-accordion-item assignés.
   */
  @queryAssignedElements({ selector: 'agi-accordion-item', flatten: true })
  private _items!: AccordionItem[];

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('agi-accordion-item-toggle', this._handleItemToggle);
  }

  disconnectedCallback() {
    this.removeEventListener('agi-accordion-item-toggle', this._handleItemToggle);
    super.disconnectedCallback();
  }

  /**
   * Gère l'événement de bascule d'un élément enfant.
   * @param event L'événement de bascule.
   */
  private _handleItemToggle(event: Event) {
    const item = event.target as AccordionItem;

    if (item.open && !this.multiple) {
      // Fermer tous les autres éléments si 'multiple' est faux
      this._items.forEach(otherItem => {
        if (otherItem !== item && otherItem.open) {
          otherItem.open = false;
        }
      });
    }
  }

  render() {
    return html`
      <div class="container" part="container">
        <slot @slotchange=${this._handleSlotChange}></slot>
      </div>
    `;
  }

  /**
   * Assure que seuls les éléments agi-accordion-item sont gérés.
   */
  private _handleSlotChange() {
    // La propriété _items est mise à jour automatiquement par @queryAssignedElements
    // On peut ajouter ici une logique d'initialisation si nécessaire.
    // Par exemple, s'assurer qu'un seul élément est ouvert au départ si 'multiple' est faux.
    if (!this.multiple && this._items && this._items.filter(item => item.open).length > 1) {
        // Fermer tous sauf le premier trouvé
        let firstOpen = false;
        this._items.forEach(item => {
            if (item.open && !firstOpen) {
                firstOpen = true;
            } else if (item.open) {
                item.open = false;
            }
        });
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-accordion': AgiAccordion;
  }
}
