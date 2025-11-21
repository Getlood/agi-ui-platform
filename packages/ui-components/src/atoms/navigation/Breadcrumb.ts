import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

/**
 * @typedef {Object} BreadcrumbItem
 * @property {string} label - Le texte affiché pour l'élément.
 * @property {string} href - L'URL de destination de l'élément.
 * @property {boolean} [active=false] - Indique si l'élément est le dernier (actif) et non cliquable.
 */

/**
 * Composant Web Component pour un Fil d'Ariane (Breadcrumb).
 *
 * @tag agi-breadcrumb
 * @category navigation
 * @property {BreadcrumbItem[]} items - La liste des éléments du fil d'Ariane.
 * @property {string} separator - Le séparateur à utiliser entre les éléments.
 */
@customElement('agi-breadcrumb')
export class AgiBreadcrumb extends LitElement {
  /**
   * La liste des éléments du fil d'Ariane.
   * Chaque élément doit avoir une 'label' et un 'href'.
   * @type {BreadcrumbItem[]}
   */
  @property({ type: Array })
  items = [];

  /**
   * Le séparateur à utiliser entre les éléments.
   * @type {string}
   */
  @property({ type: String })
  separator = '/';

  static styles = css\`
    :host {
      display: block;
      font-family: sans-serif;
    }
    nav {
      padding: 8px 0;
    }
    ol {
      display: flex;
      flex-wrap: wrap;
      list-style: none;
      padding: 0;
      margin: 0;
    }
    li {
      display: flex;
      align-items: center;
      font-size: 14px;
    }
    a {
      color: #007bff; /* Couleur de lien standard */
      text-decoration: none;
      padding: 0 4px;
      transition: color 0.2s ease-in-out;
    }
    a:hover {
      color: #0056b3;
      text-decoration: underline;
    }
    .active {
      color: #6c757d; /* Couleur pour l'élément actif/dernier */
      pointer-events: none; /* Rendre non cliquable */
      cursor: default;
      font-weight: 600;
    }
    .separator {
      margin: 0 8px;
      color: #6c757d;
      user-select: none;
    }
  \`;

  render() {
    if (!this.items || this.items.length === 0) {
      return html\`<nav aria-label="breadcrumb"></nav>\`;
    }

    return html\`
      <nav aria-label="breadcrumb">
        <ol>
          ${repeat(
            this.items,
            (item, index) => html\`
              <li aria-current="${item.active ? 'page' : 'false'}">
                ${index > 0
                  ? html\`<span class="separator" aria-hidden="true">${this.separator}</span>\`
                  : ''}
                <a
                  href="${item.href}"
                  class="${item.active ? 'active' : ''}"
                  aria-label="${item.label}"
                >
                  ${item.label}
                </a>
              </li>
            \`
          )}
        </ol>
      </nav>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-breadcrumb': AgiBreadcrumb;
  }
}
