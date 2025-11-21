import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @tag agi-divider
 * @summary Un séparateur visuel pour organiser le contenu.
 * @category display
 *
 * @property {'horizontal' | 'vertical'} orientation - L'orientation du séparateur.
 * @cssprop [--agi-divider-color=var(--agi-color-border, #ccc)] - La couleur du séparateur.
 * @cssprop [--agi-divider-thickness=1px] - L'épaisseur du séparateur.
 * @cssprop [--agi-divider-margin=8px 0] - La marge autour du séparateur.
 */
@customElement('agi-divider')
export class AgiDivider extends LitElement {
  static styles = css\`
    :host {
      display: block;
      box-sizing: border-box;
      /* Variables CSS par défaut */
      --agi-divider-color: var(--agi-color-border, #ccc);
      --agi-divider-thickness: 1px;
      --agi-divider-margin: 8px 0;
    }

    .divider {
      background-color: var(--agi-divider-color);
      margin: var(--agi-divider-margin);
    }

    /* Orientation horizontale (par défaut) */
    .divider[orientation='horizontal'] {
      width: 100%;
      height: var(--agi-divider-thickness);
    }

    /* Orientation verticale */
    .divider[orientation='vertical'] {
      display: inline-block;
      width: var(--agi-divider-thickness);
      height: 100%;
      min-height: 1em; /* Assure une hauteur minimale pour la visibilité */
      vertical-align: middle;
    }
  \`;

  /**
   * L'orientation du séparateur.
   * @type {'horizontal' | 'vertical'}
   */
  @property({ type: String, reflect: true })
  orientation: 'horizontal' | 'vertical' = 'horizontal';

  render() {
    return html\`
      <div class="divider" role="separator" orientation=\${this.orientation}></div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-divider': AgiDivider;
  }
}
