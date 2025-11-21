/**
 * DataTable - Organisme Complexe
 * Tableau de données avec tri, filtrage, pagination et sélection
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: any) => any;
}

export interface DataTableConfig {
  columns: Column[];
  data: any[];
  selectable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  sortable?: boolean;
  filterable?: boolean;
}

@customElement('agi-datatable')
export class AgiDataTable extends LitElement {
  static styles = css\`
    :host {
      display: block;
      width: 100%;
    }

    .datatable {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      overflow: hidden;
      background: white;
    }

    .datatable-header {
      padding: 1rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .datatable-search {
      padding: 0.5rem 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      width: 300px;
    }

    .datatable-table {
      width: 100%;
      border-collapse: collapse;
    }

    .datatable-thead {
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
    }

    .datatable-th {
      padding: 0.75rem 1rem;
      text-align: left;
      font-weight: 600;
      font-size: 0.875rem;
      color: #374151;
      cursor: pointer;
      user-select: none;
    }

    .datatable-th:hover {
      background: #f3f4f6;
    }

    .datatable-th.sortable::after {
      content: '⇅';
      margin-left: 0.5rem;
      opacity: 0.3;
    }

    .datatable-th.sorted-asc::after {
      content: '↑';
      opacity: 1;
    }

    .datatable-th.sorted-desc::after {
      content: '↓';
      opacity: 1;
    }

    .datatable-td {
      padding: 0.75rem 1rem;
      border-bottom: 1px solid #e5e7eb;
      font-size: 0.875rem;
      color: #1f2937;
    }

    .datatable-tr:hover {
      background: #f9fafb;
    }

    .datatable-tr.selected {
      background: #eff6ff;
    }

    .datatable-checkbox {
      width: 1rem;
      height: 1rem;
      cursor: pointer;
    }

    .datatable-footer {
      padding: 1rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .datatable-pagination {
      display: flex;
      gap: 0.5rem;
    }

    .datatable-page-btn {
      padding: 0.5rem 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      background: white;
      cursor: pointer;
      font-size: 0.875rem;
    }

    .datatable-page-btn:hover:not(:disabled) {
      background: #f3f4f6;
    }

    .datatable-page-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .datatable-page-btn.active {
      background: #3b82f6;
      color: white;
      border-color: #3b82f6;
    }

    .datatable-empty {
      padding: 3rem;
      text-align: center;
      color: #9ca3af;
    }
  \`;

  @property({ type: Array })
  columns: Column[] = [];

  @property({ type: Array })
  data: any[] = [];

  @property({ type: Boolean })
  selectable = false;

  @property({ type: Boolean })
  pagination = true;

  @property({ type: Number })
  pageSize = 10;

  @property({ type: Boolean })
  sortable = true;

  @property({ type: Boolean })
  filterable = true;

  @state()
  private selectedRows = new Set<number>();

  @state()
  private currentPage = 1;

  @state()
  private sortColumn: string | null = null;

  @state()
  private sortDirection: 'asc' | 'desc' = 'asc';

  @state()
  private searchQuery = '';

  private get filteredData() {
    if (!this.searchQuery) return this.data;
    
    return this.data.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    );
  }

  private get sortedData() {
    if (!this.sortColumn) return this.filteredData;

    return [...this.filteredData].sort((a, b) => {
      const aVal = a[this.sortColumn!];
      const bVal = b[this.sortColumn!];
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  private get paginatedData() {
    if (!this.pagination) return this.sortedData;

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return this.sortedData.slice(start, end);
  }

  private get totalPages() {
    return Math.ceil(this.sortedData.length / this.pageSize);
  }

  private handleSort(column: Column) {
    if (!column.sortable && !this.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }
  }

  private handleSelectAll(e: Event) {
    const checked = (e.target as HTMLInputElement).checked;
    if (checked) {
      this.paginatedData.forEach((_, index) => {
        this.selectedRows.add((this.currentPage - 1) * this.pageSize + index);
      });
    } else {
      this.selectedRows.clear();
    }
    this.requestUpdate();
  }

  private handleSelectRow(index: number) {
    const globalIndex = (this.currentPage - 1) * this.pageSize + index;
    if (this.selectedRows.has(globalIndex)) {
      this.selectedRows.delete(globalIndex);
    } else {
      this.selectedRows.add(globalIndex);
    }
    this.requestUpdate();
    
    this.dispatchEvent(new CustomEvent('selection-change', {
      detail: { selected: Array.from(this.selectedRows) }
    }));
  }

  private handleSearch(e: Event) {
    this.searchQuery = (e.target as HTMLInputElement).value;
    this.currentPage = 1;
  }

  private handlePageChange(page: number) {
    this.currentPage = page;
  }

  render() {
    return html\`
      <div class="datatable">
        ${this.filterable ? html\`
          <div class="datatable-header">
            <input
              type="text"
              class="datatable-search"
              placeholder="Rechercher..."
              @input=\${this.handleSearch}
            />
            <div>
              \${this.selectedRows.size} sélectionné(s)
            </div>
          </div>
        \` : ''}

        <table class="datatable-table">
          <thead class="datatable-thead">
            <tr>
              ${this.selectable ? html\`
                <th class="datatable-th" style="width: 40px;">
                  <input
                    type="checkbox"
                    class="datatable-checkbox"
                    @change=\${this.handleSelectAll}
                  />
                </th>
              \` : ''}
              ${this.columns.map(column => html\`
                <th
                  class="datatable-th \${column.sortable !== false && this.sortable ? 'sortable' : ''} \${this.sortColumn === column.key ? \`sorted-\${this.sortDirection}\` : ''}"
                  style="\${column.width ? \`width: \${column.width}\` : ''}"
                  @click=\${() => this.handleSort(column)}
                >
                  \${column.label}
                </th>
              \`)}
            </tr>
          </thead>
          <tbody>
            ${this.paginatedData.length === 0 ? html\`
              <tr>
                <td colspan="\${this.columns.length + (this.selectable ? 1 : 0)}" class="datatable-empty">
                  Aucune donnée à afficher
                </td>
              </tr>
            \` : this.paginatedData.map((row, index) => {
              const globalIndex = (this.currentPage - 1) * this.pageSize + index;
              return html\`
                <tr class="datatable-tr \${this.selectedRows.has(globalIndex) ? 'selected' : ''}">
                  ${this.selectable ? html\`
                    <td class="datatable-td">
                      <input
                        type="checkbox"
                        class="datatable-checkbox"
                        .checked=\${this.selectedRows.has(globalIndex)}
                        @change=\${() => this.handleSelectRow(index)}
                      />
                    </td>
                  \` : ''}
                  ${this.columns.map(column => html\`
                    <td class="datatable-td">
                      \${column.render ? column.render(row[column.key], row) : row[column.key]}
                    </td>
                  \`)}
                </tr>
              \`;
            })}
          </tbody>
        </table>

        ${this.pagination && this.totalPages > 1 ? html\`
          <div class="datatable-footer">
            <div>
              Page \${this.currentPage} sur \${this.totalPages}
            </div>
            <div class="datatable-pagination">
              <button
                class="datatable-page-btn"
                ?disabled=\${this.currentPage === 1}
                @click=\${() => this.handlePageChange(this.currentPage - 1)}
              >
                Précédent
              </button>
              ${Array.from({ length: this.totalPages }, (_, i) => i + 1).map(page => html\`
                <button
                  class="datatable-page-btn \${page === this.currentPage ? 'active' : ''}"
                  @click=\${() => this.handlePageChange(page)}
                >
                  \${page}
                </button>
              \`)}
              <button
                class="datatable-page-btn"
                ?disabled=\${this.currentPage === this.totalPages}
                @click=\${() => this.handlePageChange(this.currentPage + 1)}
              >
                Suivant
              </button>
            </div>
          </div>
        \` : ''}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-datatable': AgiDataTable;
  }
}

// Metadata for VLA
export const DataTableMetadata = {
  tag: 'agi-datatable',
  category: 'organism',
  description: 'Tableau de données avec tri, filtrage et pagination',
  props: [
    { name: 'columns', type: 'array', description: 'Colonnes du tableau' },
    { name: 'data', type: 'array', description: 'Données à afficher' },
    { name: 'selectable', type: 'boolean', default: false, description: 'Sélection de lignes' },
    { name: 'pagination', type: 'boolean', default: true, description: 'Pagination' },
    { name: 'pageSize', type: 'number', default: 10, description: 'Taille de page' },
    { name: 'sortable', type: 'boolean', default: true, description: 'Tri activé' },
    { name: 'filterable', type: 'boolean', default: true, description: 'Filtrage activé' },
  ],
  events: ['selection-change'],
  complexity: 'high',
  useCases: ['Afficher des données tabulaires', 'Gestion de listes', 'Dashboards'],
};
