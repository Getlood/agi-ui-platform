import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { computePosition, flip, shift, offset, arrow, Placement } from '@floating-ui/dom';

// Définition des placements possibles pour l'info-bulle
type PopoverPlacement = Placement;

@customElement('agi-popover')
export class AgiPopover extends LitElement {
  static styles = css\`
    :host {
      display: contents; /* Permet au composant de ne pas affecter le flux de la mise en page */
    }

    .popover-container {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1000;
      padding: 8px 12px;
      border-radius: 4px;
      background-color: var(--agi-popover-background, #333);
      color: var(--agi-popover-color, #fff);
      font-size: 14px;
      line-height: 1.4;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.2s, visibility 0.2s;
      pointer-events: none; /* Important pour ne pas bloquer les clics */
    }

    .popover-container[data-show] {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
    }

    .popover-arrow {
      position: absolute;
      background: var(--agi-popover-background, #333);
      width: 8px;
      height: 8px;
      transform: rotate(45deg);
    }
  \`;

  /**
   * Le placement de l'info-bulle par rapport à son élément déclencheur.
   * Les valeurs possibles sont 'top', 'bottom', 'left', 'right' et leurs variantes.
   */
  @property({ type: String })
  placement: PopoverPlacement = 'bottom';

  /**
   * Indique si l'info-bulle est visible.
   */
  @property({ type: Boolean, reflect: true })
  open: boolean = false;

  /**
   * Le décalage en pixels entre l'élément déclencheur et l'info-bulle.
   */
  @property({ type: Number })
  offset: number = 10;

  /**
   * Sélecteur CSS pour l'élément qui déclenche l'affichage de l'info-bulle.
   * Si non spécifié, le parent du composant sera utilisé.
   */
  @property({ type: String })
  triggerSelector: string = '';

  @state()
  private x: number = 0;

  @state()
  private y: number = 0;

  @state()
  private actualPlacement: PopoverPlacement = this.placement;

  private popoverElement: HTMLElement | null = null;
  private arrowElement: HTMLElement | null = null;
  private triggerElement: Element | null = null;

  // Référence à l'élément flèche pour floating-ui
  private arrowRef = html`<div class="popover-arrow" id="arrow"></div>`;

  // Méthode pour trouver l'élément déclencheur
  private getTriggerElement(): Element | null {
    if (this.triggerSelector) {
      return this.closest(this.triggerSelector);
    }
    return this.parentElement;
  }

  // Méthode pour mettre à jour la position de l'info-bulle
  private async updatePosition() {
    if (!this.open || !this.triggerElement || !this.popoverElement || !this.arrowElement) {
      return;
    }

    const { x, y, placement, middlewareData } = await computePosition(
      this.triggerElement,
      this.popoverElement,
      {
        placement: this.placement,
        middleware: [
          offset(this.offset),
          flip(),
          shift({ padding: 5 }),
          arrow({ element: this.arrowElement }),
        ],
      }
    );

    this.x = x;
    this.y = y;
    this.actualPlacement = placement;

    // Application des styles de positionnement
    Object.assign(this.popoverElement.style, {
      left: `${this.x}px`,
      top: `${this.y}px`,
    });

    // Positionnement de la flèche
    const side = placement.split('-')[0];
    const staticSide = {
      top: 'bottom',
      right: 'left',
      bottom: 'top',
      left: 'right',
    }[side];

    const { x: arrowX, y: arrowY } = middlewareData.arrow || {};

    Object.assign(this.arrowElement.style, {
      left: arrowX != null ? `${arrowX}px` : '',
      top: arrowY != null ? `${arrowY}px` : '',
      right: '',
      bottom: '',
      [staticSide as string]: '-4px', // La moitié de la taille de la flèche
    });
  }

  // Lifecycle hook appelé après la première mise à jour
  protected firstUpdated(changedProperties: PropertyValues) {
    super.firstUpdated(changedProperties);
    this.popoverElement = this.shadowRoot!.querySelector('.popover-container');
    this.arrowElement = this.shadowRoot!.querySelector('.popover-arrow');
    this.triggerElement = this.getTriggerElement();

    // Ajout d'un écouteur d'événement pour le redimensionnement de la fenêtre
    window.addEventListener('resize', () => this.updatePosition());
  }

  // Lifecycle hook appelé après chaque mise à jour
  protected updated(changedProperties: PropertyValues) {
    super.updated(changedProperties);
    if (changedProperties.has('open') && this.open) {
      this.updatePosition();
    }
    if (changedProperties.has('placement') || changedProperties.has('offset')) {
      this.updatePosition();
    }
  }

  // Rendu du composant
  render() {
    return html\`
      <div class="popover-container" ?data-show=\${this.open} role="tooltip" part="popover">
        <slot></slot>
        \${this.arrowRef}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-popover': AgiPopover;
  }
}
