import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

/**
 * @typedef {Object} TimelineItem
 * @property {string} title - Le titre de l'événement.
 * @property {string} content - La description de l'événement.
 * @property {string} date - La date ou la période de l'événement.
 * @property {'left' | 'right'} [position='left'] - La position de l'événement sur la ligne de temps.
 */

/**
 * Composant Web Component pour afficher une ligne de temps (Timeline).
 *
 * @tag agi-timeline
 * @category display
 *
 * @property {TimelineItem[]} items - La liste des événements à afficher.
 * @property {boolean} reverse - Inverse l'ordre d'affichage des événements.
 */
@customElement('agi-timeline')
export class AgiTimeline extends LitElement {
  static styles = css\`
    :host {
      display: block;
      padding: 1rem;
    }

    .timeline {
      position: relative;
      max-width: 1200px;
      margin: 0 auto;
    }

    /* Ligne verticale centrale */
    .timeline::after {
      content: '';
      position: absolute;
      width: 6px;
      background-color: var(--agi-timeline-line-color, #e0e0e0);
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -3px;
    }

    .container {
      padding: 10px 40px;
      position: relative;
      background-color: inherit;
      width: 50%;
    }

    /* Cercle indicateur */
    .container::after {
      content: '';
      position: absolute;
      width: 25px;
      height: 25px;
      right: -17px;
      background-color: var(--agi-timeline-dot-bg, white);
      border: 4px solid var(--agi-timeline-dot-border, #4CAF50);
      top: 15px;
      border-radius: 50%;
      z-index: 1;
    }

    /* Conteneurs positionnés à gauche */
    .left {
      left: 0;
    }

    /* Conteneurs positionnés à droite */
    .right {
      left: 50%;
    }

    /* Flèche pour les conteneurs de gauche */
    .left::before {
      content: " ";
      height: 0;
      position: absolute;
      top: 22px;
      width: 0;
      z-index: 1;
      right: 30px;
      border: medium solid var(--agi-timeline-card-bg, white);
      border-width: 10px 0 10px 10px;
      border-color: transparent transparent transparent var(--agi-timeline-card-bg, white);
    }

    /* Flèche pour les conteneurs de droite */
    .right::before {
      content: " ";
      height: 0;
      position: absolute;
      top: 22px;
      width: 0;
      z-index: 1;
      left: 30px;
      border: medium solid var(--agi-timeline-card-bg, white);
      border-width: 10px 10px 10px 0;
      border-color: transparent var(--agi-timeline-card-bg, white) transparent transparent;
    }

    /* Cercle indicateur pour les conteneurs de droite */
    .right::after {
      left: -16px;
    }

    .content {
      padding: 20px 30px;
      background-color: var(--agi-timeline-card-bg, white);
      position: relative;
      border-radius: 6px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    }

    .date {
      font-weight: bold;
      color: var(--agi-timeline-date-color, #4CAF50);
      margin-bottom: 0.5rem;
    }

    /* Media queries pour les petits écrans */
    @media screen and (max-width: 600px) {
      /* La ligne de temps est centrée */
      .timeline::after {
        left: 31px;
      }

      /* Tous les conteneurs sont à gauche */
      .container {
        width: 100%;
        padding-left: 70px;
        padding-right: 25px;
      }

      /* Tous les conteneurs sont à gauche */
      .left, .right {
        left: 0;
      }

      /* Flèche de gauche */
      .left::before, .right::before {
        right: auto;
        left: 60px;
        border-color: transparent var(--agi-timeline-card-bg, white) transparent transparent;
      }

      /* Cercle indicateur de gauche */
      .left::after, .right::after {
        left: 15px;
      }

      /* Le contenu est à gauche */
      .right {
        left: 0%;
      }
    }
  \`;

  /**
   * @type {TimelineItem[]}
   */
  @property({ type: Array })
  items = [];

  @property({ type: Boolean })
  reverse = false;

  renderItem(item: TimelineItem, index: number) {
    const positionClass = item.position === 'right' || (index % 2 !== 0 && !item.position) ? 'right' : 'left';

    return html\`
      <div class="container \${positionClass}">
        <div class="content">
          <div class="date">\${item.date}</div>
          <h3>\${item.title}</h3>
          <p>\${item.content}</p>
        </div>
      </div>
    \`;
  }

  render() {
    const sortedItems = this.reverse ? [...this.items].reverse() : this.items;

    return html\`
      <div class="timeline">
        \${sortedItems.map((item, index) => this.renderItem(item, index))}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-timeline': AgiTimeline;
  }
}

// Définition de type pour VLA (pour la documentation)
export type TimelineItem = {
  title: string;
  content: string;
  date: string;
  position?: 'left' | 'right';
};
