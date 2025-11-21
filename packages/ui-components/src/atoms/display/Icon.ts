import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @typedef {'top' | 'bottom' | 'left' | 'right'} TooltipPlacement
 * 
 * @tag agi-tooltip
 * @summary Un composant d'info-bulle (tooltip) simple et réutilisable.
 * 
 * @property {string} content - Le contenu textuel à afficher dans l'info-bulle.
 * @property {TooltipPlacement} placement - La position de l'info-bulle par rapport à son élément parent ('top', 'bottom', 'left', 'right').
 * 
 * @csspart tooltip - Le conteneur principal de l'info-bulle.
 * @csspart content - Le contenu de l'info-bulle.
 * 
 * @slot - L'élément autour duquel l'info-bulle doit s'afficher.
 */
@customElement('agi-tooltip')
export class AgiTooltip extends LitElement {

  static styles = css\`
    :host {
      /* Le composant doit être un conteneur pour l'élément slot et l'info-bulle */
      display: inline-block;
      position: relative;
    }

    .tooltip-container {
      /* Cache l'info-bulle par défaut */
      visibility: hidden;
      opacity: 0;
      transition: opacity 0.3s, visibility 0.3s;
      
      /* Positionnement de base */
      position: absolute;
      z-index: 1000;
      padding: 8px 12px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.4;
      white-space: nowrap;
      
      /* Styles visuels */
      background-color: #333;
      color: #fff;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    }

    /* Affichage au survol */
    :host(:hover) .tooltip-container {
      visibility: visible;
      opacity: 1;
    }

    /* Styles pour la flèche (triangle) */
    .tooltip-container::after {
      content: "";
      position: absolute;
      border-width: 5px;
      border-style: solid;
    }

    /* Placement: top */
    :host([placement="top"]) .tooltip-container {
      bottom: 100%; /* Au-dessus de l'élément */
      left: 50%;
      transform: translateX(-50%) translateY(-8px); /* Centrage et décalage */
    }
    :host([placement="top"]) .tooltip-container::after {
      top: 100%;
      left: 50%;
      margin-left: -5px;
      border-color: #333 transparent transparent transparent;
    }

    /* Placement: bottom */
    :host([placement="bottom"]) .tooltip-container {
      top: 100%; /* En dessous de l'élément */
      left: 50%;
      transform: translateX(-50%) translateY(8px);
    }
    :host([placement="bottom"]) .tooltip-container::after {
      bottom: 100%;
      left: 50%;
      margin-left: -5px;
      border-color: transparent transparent #333 transparent;
    }

    /* Placement: left */
    :host([placement="left"]) .tooltip-container {
      right: 100%; /* À gauche de l'élément */
      top: 50%;
      transform: translateY(-50%) translateX(-8px);
    }
    :host([placement="left"]) .tooltip-container::after {
      left: 100%;
      top: 50%;
      margin-top: -5px;
      border-color: transparent transparent transparent #333;
    }

    /* Placement: right */
    :host([placement="right"]) .tooltip-container {
      left: 100%; /* À droite de l'élément */
      top: 50%;
      transform: translateY(-50%) translateX(8px);
    }
    :host([placement="right"]) .tooltip-container::after {
      right: 100%;
      top: 50%;
      margin-top: -5px;
      border-color: transparent #333 transparent transparent;
    }
  \`;

  /**
   * Le contenu textuel à afficher dans l'info-bulle.
   */
  @property({ type: String })
  content: string = '';

  /**
   * La position de l'info-bulle par rapport à son élément parent.
   * @type {'top' | 'bottom' | 'left' | 'right'}
   */
  @property({ type: String, reflect: true })
  placement: 'top' | 'bottom' | 'left' | 'right' = 'top';

  render() {
    return html\`
      <slot></slot>
      <div part="tooltip" class="tooltip-container">
        <div part="content" class="tooltip-content">\${this.content}</div>
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-tooltip': AgiTooltip;
  }
}
