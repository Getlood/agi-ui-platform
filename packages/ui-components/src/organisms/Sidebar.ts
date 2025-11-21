/**
 * Sidebar - Organisme Complexe
 * Barre latérale de navigation avec collapse et multi-niveaux
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface SidebarItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: SidebarItem[];
  badge?: string;
}

@customElement('agi-sidebar')
export class AgiSidebar extends LitElement {
  static styles = css\`
    :host {
      display: block;
      height: 100%;
    }

    .sidebar {
      height: 100%;
      background: #1f2937;
      color: white;
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      overflow: hidden;
    }

    .sidebar.expanded {
      width: 256px;
    }

    .sidebar.collapsed {
      width: 64px;
    }

    .sidebar-header {
      padding: 1rem;
      border-bottom: 1px solid #374151;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .sidebar-logo {
      font-size: 1.25rem;
      font-weight: 700;
      white-space: nowrap;
      overflow: hidden;
    }

    .sidebar-toggle {
      background: none;
      border: none;
      color: white;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .sidebar-toggle:hover {
      background: #374151;
    }

    .sidebar-nav {
      flex: 1;
      overflow-y: auto;
      padding: 1rem 0;
    }

    .sidebar-item {
      padding: 0.75rem 1rem;
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
      text-decoration: none;
      color: #d1d5db;
    }

    .sidebar-item:hover {
      background: #374151;
      color: white;
    }

    .sidebar-item.active {
      background: #3b82f6;
      color: white;
    }

    .sidebar-item-icon {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
    }

    .sidebar-item-label {
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .sidebar-item-badge {
      background: #ef4444;
      color: white;
      padding: 0.125rem 0.5rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    .sidebar-item-arrow {
      transition: transform 0.2s;
    }

    .sidebar-item-arrow.expanded {
      transform: rotate(90deg);
    }

    .sidebar-children {
      padding-left: 2rem;
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .sidebar-children.expanded {
      max-height: 1000px;
    }

    .sidebar-footer {
      padding: 1rem;
      border-top: 1px solid #374151;
    }

    .collapsed .sidebar-item-label,
    .collapsed .sidebar-item-badge,
    .collapsed .sidebar-item-arrow,
    .collapsed .sidebar-logo {
      display: none;
    }

    .collapsed .sidebar-children {
      display: none;
    }
  \`;

  @property({ type: Array })
  items: SidebarItem[] = [];

  @property({ type: Boolean })
  collapsed = false;

  @property({ type: String })
  logo = 'AGI-UI';

  @property({ type: String })
  position: 'left' | 'right' = 'left';

  @state()
  private expandedItems = new Set<string>();

  @state()
  private activeItem: string | null = null;

  private toggleCollapse() {
    this.collapsed = !this.collapsed;
    this.dispatchEvent(new CustomEvent('toggle', {
      detail: { collapsed: this.collapsed }
    }));
  }

  private toggleItem(itemId: string) {
    if (this.expandedItems.has(itemId)) {
      this.expandedItems.delete(itemId);
    } else {
      this.expandedItems.add(itemId);
    }
    this.requestUpdate();
  }

  private handleItemClick(item: SidebarItem) {
    if (item.children && item.children.length > 0) {
      this.toggleItem(item.id);
    } else {
      this.activeItem = item.id;
      this.dispatchEvent(new CustomEvent('item-click', {
        detail: { item }
      }));
    }
  }

  private renderItem(item: SidebarItem, level = 0) {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = this.expandedItems.has(item.id);
    const isActive = this.activeItem === item.id;

    return html\`
      <div>
        <a
          class="sidebar-item \${isActive ? 'active' : ''}"
          href=\${item.href || '#'}
          @click=\${(e: Event) => {
            if (!item.href) e.preventDefault();
            this.handleItemClick(item);
          }}
        >
          ${item.icon ? html\`
            <span class="sidebar-item-icon">\${item.icon}</span>
          \` : ''}
          <span class="sidebar-item-label">\${item.label}</span>
          ${item.badge ? html\`
            <span class="sidebar-item-badge">\${item.badge}</span>
          \` : ''}
          ${hasChildren ? html\`
            <span class="sidebar-item-arrow \${isExpanded ? 'expanded' : ''}">
              ▸
            </span>
          \` : ''}
        </a>
        ${hasChildren ? html\`
          <div class="sidebar-children \${isExpanded ? 'expanded' : ''}">
            \${item.children!.map(child => this.renderItem(child, level + 1))}
          </div>
        \` : ''}
      </div>
    \`;
  }

  render() {
    return html\`
      <div class="sidebar \${this.collapsed ? 'collapsed' : 'expanded'}">
        <div class="sidebar-header">
          <div class="sidebar-logo">\${this.logo}</div>
          <button
            class="sidebar-toggle"
            @click=\${this.toggleCollapse}
            aria-label=\${this.collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            \${this.collapsed ? '☰' : '✕'}
          </button>
        </div>

        <nav class="sidebar-nav">
          \${this.items.map(item => this.renderItem(item))}
        </nav>

        <div class="sidebar-footer">
          <slot name="footer"></slot>
        </div>
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-sidebar': AgiSidebar;
  }
}

// Metadata for VLA
export const SidebarMetadata = {
  tag: 'agi-sidebar',
  category: 'organism',
  description: 'Barre latérale de navigation avec collapse',
  props: [
    { name: 'items', type: 'array', description: 'Items de navigation' },
    { name: 'collapsed', type: 'boolean', default: false, description: 'État collapsed' },
    { name: 'logo', type: 'string', default: 'AGI-UI', description: 'Logo/titre' },
    { name: 'position', type: 'string', default: 'left', description: 'Position (left, right)' },
  ],
  slots: ['footer'],
  events: ['toggle', 'item-click'],
  complexity: 'high',
  useCases: ['Navigation principale', 'Dashboards', 'Applications'],
};
