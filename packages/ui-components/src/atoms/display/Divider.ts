import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @tag agi-icon
 * @category display
 * @props_count 2
 *
 * Composant d'icône basé sur Lit Element.
 * Il affiche une icône en utilisant un nom et une taille spécifiés.
 * Pour la démonstration, il simule l'affichage d'une icône en utilisant un caractère unicode.
 * Dans une application réelle, ce composant chargerait un SVG ou utiliserait une police d'icônes.
 */
@customElement('agi-icon')
export class AgiIcon extends LitElement {
  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
      /* Utilisation de la variable CSS pour la taille par défaut */
      --agi-icon-size: 24px;
    }

    .icon {
      /* La taille de la police est définie par la propriété size */
      font-size: var(--agi-icon-size);
      width: var(--agi-icon-size);
      height: var(--agi-icon-size);
      /* Couleur par défaut */
      color: currentColor;
      /* Pour s'assurer que l'icône est centrée */
      display: flex;
      align-items: center;
      justify-content: center;
    }
  `;

  /**
   * Le nom de l'icône à afficher.
   * (Ex: 'home', 'settings', 'check').
   * Pour la démo, il est utilisé pour simuler le contenu.
   */
  @property({ type: String })
  name: string = 'star';

  /**
   * La taille de l'icône (Ex: '24px', '1.5em', '32').
   * La valeur est appliquée à la variable CSS --agi-icon-size.
   */
  @property({ type: String })
  size: string = '24px';

  // Méthode pour simuler le rendu d'une icône basée sur le nom
  private _getIconContent(name: string): string {
    switch (name.toLowerCase()) {
      case 'home':
        return '🏠'; // Unicode pour Maison
      case 'settings':
        return '⚙️'; // Unicode pour Engrenage
      case 'check':
        return '✅'; // Unicode pour Coche
      case 'star':
        return '⭐'; // Unicode pour Étoile
      default:
        return '❓'; // Unicode pour Point d'interrogation
    }
  }

  render() {
    // Applique la taille via une variable CSS pour une meilleure encapsulation des styles
    const style = `--agi-icon-size: ${this.size};`;

    return html`
      <span class="icon" style=${style} title=${this.name}>
        ${this._getIconContent(this.name)}
      </span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-icon': AgiIcon;
  }
}
