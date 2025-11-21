import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

export interface NavbarItem {
  label: string;
  href?: string;
  onClick?: () => void;
}

@customElement('agi-navbar')
export class AgiNavbar extends LitElement {
  static styles = css\`
    :host {
      display: block;
    }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: #1f2937;
      color: white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .navbar-brand {
      font-size: 1.5rem;
      font-weight: 700;
    }

    .navbar-nav {
      display: flex;
      gap: 2rem;
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .navbar-item {
      color: #d1d5db;
      text-decoration: none;
      transition: color 0.2s;
      cursor: pointer;
    }

    .navbar-item:hover {
      color: white;
    }

    .navbar-actions {
      display: flex;
      gap: 1rem;
    }
  \`;

  @property({ type: String })
  brand = 'AGI-UI';

  @property({ type: Array })
  items: NavbarItem[] = [];

  render() {
    return html\`
      <nav class="navbar">
        <div class="navbar-brand">\${this.brand}</div>
        <ul class="navbar-nav">
          \${this.items.map(item => html\`
            <li>
              <a
                class="navbar-item"
                href=\${item.href || '#'}
                @click=\${item.onClick}
              >
                \${item.label}
              </a>
            </li>
          \`)}
        </ul>
        <div class="navbar-actions">
          <slot name="actions"></slot>
        </div>
      </nav>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-navbar': AgiNavbar;
  }
}

export const NavbarMetadata = {
  tag: 'agi-navbar',
  category: 'navigation',
  description: 'Barre de navigation',
  props: [
    { name: 'brand', type: 'string', default: 'AGI-UI' },
    { name: 'items', type: 'array', default: [] },
  ],
};
