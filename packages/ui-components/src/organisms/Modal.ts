/**
 * Modal - Organisme Complexe
 * Fenêtre modale avec overlay, animations et gestion du focus
 */

import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

@customElement('agi-modal')
export class AgiModal extends LitElement {
  static styles = css\`
    :host {
      display: none;
    }

    :host([open]) {
      display: block;
    }

    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      animation: fadeIn 0.2s ease-out;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .modal-container {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      max-width: 90vw;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      animation: slideUp 0.3s ease-out;
    }

    @keyframes slideUp {
      from {
        transform: translateY(20px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }

    .modal-container.small {
      width: 400px;
    }

    .modal-container.medium {
      width: 600px;
    }

    .modal-container.large {
      width: 800px;
    }

    .modal-container.fullscreen {
      width: 100vw;
      height: 100vh;
      max-width: 100vw;
      max-height: 100vh;
      border-radius: 0;
    }

    .modal-header {
      padding: 1.5rem;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .modal-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #111827;
      margin: 0;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: #6b7280;
      padding: 0.25rem;
      border-radius: 0.375rem;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
    }

    .modal-close:hover {
      background: #f3f4f6;
      color: #111827;
    }

    .modal-body {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer {
      padding: 1.5rem;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
    }
  \`;

  @property({ type: Boolean, reflect: true })
  open = false;

  @property({ type: String })
  title = '';

  @property({ type: String })
  size: 'small' | 'medium' | 'large' | 'fullscreen' = 'medium';

  @property({ type: Boolean })
  closable = true;

  @property({ type: Boolean })
  closeOnOverlayClick = true;

  private handleOverlayClick(e: MouseEvent) {
    if (this.closeOnOverlayClick && e.target === e.currentTarget) {
      this.close();
    }
  }

  private handleClose() {
    this.close();
  }

  public close() {
    this.open = false;
    this.dispatchEvent(new CustomEvent('close'));
  }

  public show() {
    this.open = true;
    this.dispatchEvent(new CustomEvent('open'));
  }

  render() {
    if (!this.open) return null;

    return html\`
      <div class="modal-overlay" @click=\${this.handleOverlayClick}>
        <div class="modal-container \${this.size}">
          ${this.title || this.closable ? html\`
            <div class="modal-header">
              <h2 class="modal-title">\${this.title}</h2>
              ${this.closable ? html\`
                <button
                  class="modal-close"
                  @click=\${this.handleClose}
                  aria-label="Fermer"
                >
                  ×
                </button>
              \` : ''}
            </div>
          \` : ''}

          <div class="modal-body">
            <slot></slot>
          </div>

          <div class="modal-footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    \`;
  }

  connectedCallback() {
    super.connectedCallback();
    // Empêcher le scroll du body quand la modale est ouverte
    if (this.open) {
      document.body.style.overflow = 'hidden';
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    document.body.style.overflow = '';
  }

  updated(changedProperties: Map<string, any>) {
    if (changedProperties.has('open')) {
      document.body.style.overflow = this.open ? 'hidden' : '';
    }
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-modal': AgiModal;
  }
}

// Metadata for VLA
export const ModalMetadata = {
  tag: 'agi-modal',
  category: 'organism',
  description: 'Fenêtre modale avec overlay et animations',
  props: [
    { name: 'open', type: 'boolean', default: false, description: 'État ouvert/fermé' },
    { name: 'title', type: 'string', default: '', description: 'Titre de la modale' },
    { name: 'size', type: 'string', default: 'medium', description: 'Taille (small, medium, large, fullscreen)' },
    { name: 'closable', type: 'boolean', default: true, description: 'Bouton de fermeture' },
    { name: 'closeOnOverlayClick', type: 'boolean', default: true, description: 'Fermer en cliquant sur l\'overlay' },
  ],
  slots: ['default', 'footer'],
  events: ['open', 'close'],
  methods: ['show()', 'close()'],
  complexity: 'high',
  useCases: ['Formulaires', 'Confirmations', 'Détails', 'Images'],
};
