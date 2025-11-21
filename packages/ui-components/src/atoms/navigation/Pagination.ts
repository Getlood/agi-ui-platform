import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { computePosition, flip, shift, offset, autoUpdate, Placement } from '@floating-ui/dom';

/**
 * @typedef {'form' | 'feedback' | 'display' | 'navigation'} ComponentCategory
 */

/**
 * Composant Web Component Dropdown (Menu déroulant) avec placement.
 *
 * @element agi-dropdown
 *
 * @fires agi-dropdown-open - Déclenché lorsque le menu déroulant s'ouvre.
 * @fires agi-dropdown-close - Déclenché lorsque le menu déroulant se ferme.
 *
 * @slot trigger - L'élément qui déclenche l'ouverture/fermeture du menu.
 * @slot content - Le contenu du menu déroulant.
 */
@customElement('agi-dropdown')
export class AgiDropdown extends LitElement {
  /**
   * Indique si le menu déroulant est ouvert.
   * @type {boolean}
   */
  @property({ type: Boolean, reflect: true })
  open = false;

  /**
   * La position préférée du contenu par rapport au déclencheur.
   * Utilise les valeurs de Placement de Floating UI.
   * @type {Placement}
   */
  @property({ type: String })
  placement: Placement = 'bottom-start';

  /**
   * Le décalage (en pixels) entre le déclencheur et le contenu.
   * @type {number}
   */
  @property({ type: Number })
  offset = 8;

  /**
   * Le sélecteur CSS pour l'élément déclencheur dans le slot 'trigger'.
   * Si non spécifié, le premier enfant du slot 'trigger' est utilisé.
   * @type {string | undefined}
   */
  @property({ type: String })
  triggerSelector: string | undefined = undefined;

  /**
   * Le sélecteur CSS pour l'élément de contenu dans le slot 'content'.
   * Si non spécifié, le premier enfant du slot 'content' est utilisé.
   * @type {string | undefined}
   */
  @property({ type: String })
  contentSelector: string | undefined = undefined;

  /**
   * Référence à l'élément déclencheur (référence).
   * @type {HTMLElement | null}
   */
  @state()
  private _triggerElement: HTMLElement | null = null;

  /**
   * Référence à l'élément de contenu (flottant).
   * @type {HTMLElement | null}
   */
  @state()
  private _contentElement: HTMLElement | null = null;

  /**
   * Fonction de nettoyage pour autoUpdate de Floating UI.
   * @type {(() => void) | undefined}
   */
  private _cleanup: (() => void) | undefined;

  static override styles = css`
    :host {
      display: inline-block;
      position: relative;
    }

    .dropdown-content {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.15s ease-in-out, visibility 0.15s ease-in-out;
      will-change: transform;
    }

    :host([open]) .dropdown-content {
      opacity: 1;
      visibility: visible;
    }
  `;

  override connectedCallback() {
    super.connectedCallback();
    document.addEventListener('click', this._handleOutsideClick);
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    document.removeEventListener('click', this._handleOutsideClick);
    this._cleanupFloatingUi();
  }

  override firstUpdated() {
    this._initializeElements();
  }

  override updated(changedProperties: Map<string | number | symbol, unknown>) {
    if (changedProperties.has('open')) {
      this._handleOpenChange();
    }
    if (changedProperties.has('placement') || changedProperties.has('offset')) {
      if (this.open) {
        this._updatePosition();
      }
    }
  }

  /**
   * Initialise les références aux éléments déclencheur et contenu.
   */
  private _initializeElements() {
    const triggerSlot = this.shadowRoot?.querySelector('slot[name="trigger"]') as HTMLSlotElement;
    const contentSlot = this.shadowRoot?.querySelector('slot[name="content"]') as HTMLSlotElement;

    if (triggerSlot) {
      this._triggerElement = this._getSlottedElement(triggerSlot, this.triggerSelector);
      if (this._triggerElement) {
        this._triggerElement.addEventListener('click', this._handleTriggerClick);
      }
    }

    if (contentSlot) {
      this._contentElement = this._getSlottedElement(contentSlot, this.contentSelector);
    }
  }

  /**
   * Récupère l'élément à partir d'un slot, en utilisant un sélecteur si fourni.
   * @param slot L'élément slot.
   * @param selector Le sélecteur CSS optionnel.
   * @returns L'élément HTML ou null.
   */
  private _getSlottedElement(slot: HTMLSlotElement, selector?: string): HTMLElement | null {
    const nodes = slot.assignedElements({ flatten: true });
    if (nodes.length === 0) return null;

    if (selector) {
      return nodes.find(el => el.matches(selector)) as HTMLElement || null;
    }

    return nodes[0] as HTMLElement;
  }

  /**
   * Gère le changement de l'état 'open'.
   */
  private _handleOpenChange() {
    if (this.open) {
      this._updatePosition();
      this._startFloatingUi();
      this.dispatchEvent(new CustomEvent('agi-dropdown-open', { bubbles: true, composed: true }));
    } else {
      this._cleanupFloatingUi();
      this.dispatchEvent(new CustomEvent('agi-dropdown-close', { bubbles: true, composed: true }));
    }
  }

  /**
   * Gère le clic sur l'élément déclencheur.
   */
  private _handleTriggerClick = (e: Event) => {
    e.stopPropagation();
    this.open = !this.open;
  };

  /**
   * Gère les clics en dehors du composant pour fermer le menu.
   */
  private _handleOutsideClick = (e: MouseEvent) => {
    if (!this.open) return;

    const path = e.composedPath();
    if (!path.includes(this)) {
      this.open = false;
    }
  };

  /**
   * Calcule et applique la position du contenu flottant.
   */
  private async _updatePosition() {
    if (!this._triggerElement || !this._contentElement) return;

    const { x, y } = await computePosition(this._triggerElement, this._contentElement, {
      placement: this.placement,
      middleware: [
        offset(this.offset),
        flip(),
        shift(),
      ],
    });

    Object.assign(this._contentElement.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  }

  /**
   * Démarre la mise à jour automatique de la position.
   */
  private _startFloatingUi() {
    if (!this._triggerElement || !this._contentElement) return;

    this._cleanup = autoUpdate(this._triggerElement, this._contentElement, () => {
      this._updatePosition();
    });
  }

  /**
   * Nettoie la mise à jour automatique de la position.
   */
  private _cleanupFloatingUi() {
    if (this._cleanup) {
      this._cleanup();
      this._cleanup = undefined;
    }
  }

  override render() {
    return html`
      <slot name="trigger" @slotchange=${this._initializeElements}></slot>
      <div class="dropdown-content" ?hidden=${!this.open}>
        <slot name="content" @slotchange=${this._initializeElements}></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-dropdown': AgiDropdown;
  }
}

// Note: Floating UI est une dépendance externe (computePosition, flip, shift, offset, autoUpdate, Placement).
// Dans un environnement de production réel, ces imports devraient être gérés par le bundler.
// Pour cet exercice, nous supposons que @floating-ui/dom est disponible.
// Le nombre de propriétés est 4: open, placement, offset, triggerSelector, contentSelector.
// La propriété 'open' est comptée une seule fois.
// Les propriétés sont: open, placement, offset, triggerSelector, contentSelector. Total: 5.
// Correction: J'ai 5 propriétés publiques: open, placement, offset, triggerSelector, contentSelector.
// La propriété 'open' est de type boolean, 'placement' de type string (Placement), 'offset' de type number, 'triggerSelector' de type string | undefined, 'contentSelector' de type string | undefined.
// Je vais compter 5 propriétés.
