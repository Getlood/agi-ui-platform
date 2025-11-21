import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

export interface AccordionItem {
  id: string;
  title: string;
  content: string;
}

@customElement('agi-accordion')
export class AgiAccordion extends LitElement {
  static styles = css\`
    :host {
      display: block;
    }

    .accordion-item {
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      margin-bottom: 0.5rem;
      overflow: hidden;
    }

    .accordion-header {
      padding: 1rem;
      background: #f9fafb;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      user-select: none;
    }

    .accordion-header:hover {
      background: #f3f4f6;
    }

    .accordion-title {
      font-weight: 600;
      color: #111827;
    }

    .accordion-icon {
      transition: transform 0.2s;
    }

    .accordion-icon.expanded {
      transform: rotate(180deg);
    }

    .accordion-content {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
    }

    .accordion-content.expanded {
      max-height: 500px;
    }

    .accordion-body {
      padding: 1rem;
      color: #6b7280;
    }
  \`;

  @property({ type: Array })
  items: AccordionItem[] = [];

  @property({ type: Boolean })
  multiple = false;

  @state()
  private expandedItems = new Set<string>();

  private toggleItem(id: string) {
    if (this.multiple) {
      if (this.expandedItems.has(id)) {
        this.expandedItems.delete(id);
      } else {
        this.expandedItems.add(id);
      }
    } else {
      if (this.expandedItems.has(id)) {
        this.expandedItems.clear();
      } else {
        this.expandedItems.clear();
        this.expandedItems.add(id);
      }
    }
    this.requestUpdate();
  }

  render() {
    return html\`
      <div class="accordion">
        \${this.items.map(item => {
          const isExpanded = this.expandedItems.has(item.id);
          return html\`
            <div class="accordion-item">
              <div
                class="accordion-header"
                @click=\${() => this.toggleItem(item.id)}
              >
                <div class="accordion-title">\${item.title}</div>
                <div class="accordion-icon \${isExpanded ? 'expanded' : ''}">
                  ▼
                </div>
              </div>
              <div class="accordion-content \${isExpanded ? 'expanded' : ''}">
                <div class="accordion-body">\${item.content}</div>
              </div>
            </div>
          \`;
        })}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-accordion': AgiAccordion;
  }
}

export const AccordionMetadata = {
  tag: 'agi-accordion',
  category: 'navigation',
  description: 'Accordéon avec items',
  props: [
    { name: 'items', type: 'array', default: [] },
    { name: 'multiple', type: 'boolean', default: false },
  ],
};
