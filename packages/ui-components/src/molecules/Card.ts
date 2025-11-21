import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * Composant Card (Molecule)
 * 
 * @slot - Contenu principal de la carte
 * @slot header - En-tête de la carte
 * @slot footer - Pied de page de la carte
 * 
 * @example
 * ```html
 * <agi-card>
 *   <div slot="header">
 *     <h3>Titre de la carte</h3>
 *   </div>
 *   <p>Contenu de la carte</p>
 *   <div slot="footer">
 *     <agi-button label="Action"></agi-button>
 *   </div>
 * </agi-card>
 * ```
 */
@customElement('agi-card')
export class AgiCard extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      transition: all 0.3s ease;
    }

    .card.hoverable:hover {
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      transform: translateY(-4px);
    }

    .card.clickable {
      cursor: pointer;
    }

    .card-header {
      padding: 20px;
      border-bottom: 1px solid #e2e8f0;
      background: #f7fafc;
    }

    .card-body {
      padding: 20px;
    }

    .card-footer {
      padding: 20px;
      border-top: 1px solid #e2e8f0;
      background: #f7fafc;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
    }

    /* Variants */
    .bordered {
      border: 2px solid #e2e8f0;
      box-shadow: none;
    }

    .elevated {
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .flat {
      box-shadow: none;
      border: 1px solid #e2e8f0;
    }
  `;

  @property({ type: String })
  variant: 'default' | 'bordered' | 'elevated' | 'flat' = 'default';

  @property({ type: Boolean })
  hoverable = false;

  @property({ type: Boolean })
  clickable = false;

  private handleClick() {
    if (this.clickable) {
      this.dispatchEvent(
        new CustomEvent('agi-card-click', {
          bubbles: true,
          composed: true,
        })
      );
    }
  }

  render() {
    const classes = [
      'card',
      this.variant,
      this.hoverable ? 'hoverable' : '',
      this.clickable ? 'clickable' : '',
    ]
      .filter(Boolean)
      .join(' ');

    return html`
      <div class=${classes} @click=${this.handleClick}>
        <slot name="header" class="card-header"></slot>
        <div class="card-body">
          <slot></slot>
        </div>
        <slot name="footer" class="card-footer"></slot>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-card': AgiCard;
  }
}
