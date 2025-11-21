import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @tag agi-pagination
 * @summary Composant de pagination pour naviguer entre les pages.
 * @category navigation
 * @prop {number} total - Le nombre total de pages.
 * @prop {number} current - La page actuellement sélectionnée.
 * @fires page-change - Événement émis lorsque l'utilisateur change de page.
 */
@customElement('agi-pagination')
export class AgiPagination extends LitElement {
  /**
   * Le nombre total de pages disponibles.
   * @type {number}
   */
  @property({ type: Number })
  total: number = 1;

  /**
   * La page actuellement sélectionnée.
   * @type {number}
   */
  @property({ type: Number })
  current: number = 1;

  static styles = css\`
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      font-family: sans-serif;
      --pagination-color: #007bff;
      --pagination-text-color: #333;
      --pagination-bg-color: #fff;
      --pagination-border-color: #ccc;
      --pagination-active-bg-color: var(--pagination-color);
      --pagination-active-text-color: #fff;
      --pagination-disabled-color: #aaa;
    }

    .pagination-container {
      display: flex;
      list-style: none;
      padding: 0;
      margin: 0;
      border-radius: 4px;
      overflow: hidden;
      border: 1px solid var(--pagination-border-color);
    }

    .page-item {
      cursor: pointer;
      padding: 8px 12px;
      color: var(--pagination-text-color);
      background-color: var(--pagination-bg-color);
      border-right: 1px solid var(--pagination-border-color);
      transition: background-color 0.2s, color 0.2s;
      user-select: none;
    }

    .page-item:last-child {
      border-right: none;
    }

    .page-item:hover:not(.active):not(.disabled) {
      background-color: #f0f0f0;
    }

    .page-item.active {
      background-color: var(--pagination-active-bg-color);
      color: var(--pagination-active-text-color);
      cursor: default;
    }

    .page-item.disabled {
      color: var(--pagination-disabled-color);
      cursor: not-allowed;
      opacity: 0.6;
    }

    .info {
      margin-left: 15px;
      font-size: 0.9em;
      color: var(--pagination-text-color);
    }
  \`;

  private _handlePageChange(page: number) {
    if (page < 1 || page > this.total || page === this.current) {
      return;
    }
    this.current = page;
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { page },
      bubbles: true,
      composed: true,
    }));
  }

  private _renderPageItem(page: number, label: string | number) {
    const isActive = page === this.current;
    const isDisabled = page < 1 || page > this.total;

    return html\`
      <li
        class="page-item \${isActive ? 'active' : ''} \${isDisabled ? 'disabled' : ''}"
        @click=\${() => this._handlePageChange(page)}
        role="button"
        aria-label="Aller à la page \${page}"
        aria-current=\${isActive ? 'page' : 'false'}
        tabindex=\${isDisabled ? '-1' : '0'}
      >
        \${label}
      </li>
    \`;
  }

  render() {
    const pages: (number | string)[] = [];
    const maxPagesToShow = 5;
    const startPage = Math.max(1, this.current - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(this.total, startPage + maxPagesToShow - 1);

    // Correction pour s'assurer que nous montrons maxPagesToShow si possible
    if (endPage - startPage + 1 < maxPagesToShow) {
        const newStartPage = Math.max(1, endPage - maxPagesToShow + 1);
        // Si le total est très petit, on ne veut pas que startPage soit négatif
        if (newStartPage < startPage) {
            // Si on a ajusté startPage, on met à jour
            startPage = newStartPage;
        }
    }

    // Bouton Précédent
    pages.push(this._renderPageItem(this.current - 1, '« Précédent'));

    // Première page
    if (startPage > 1) {
      pages.push(this._renderPageItem(1, 1));
      if (startPage > 2) {
        pages.push(html\`<li class="page-item disabled">...</li>\`);
      }
    }

    // Pages centrales
    for (let i = startPage; i <= endPage; i++) {
      pages.push(this._renderPageItem(i, i));
    }

    // Dernière page
    if (endPage < this.total) {
      if (endPage < this.total - 1) {
        pages.push(html\`<li class="page-item disabled">...</li>\`);
      }
      pages.push(this._renderPageItem(this.total, this.total));
    }

    // Bouton Suivant
    pages.push(this._renderPageItem(this.current + 1, 'Suivant »'));

    return html\`
      <nav role="navigation" aria-label="Pagination">
        <ul class="pagination-container">
          \${pages}
        </ul>
      </nav>
      <div class="info">
        Page \${this.current} sur \${this.total}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-pagination': AgiPagination;
  }
}
