import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @typedef {Object} FileUploadEventDetail
 * @property {FileList | null} files - La liste des fichiers sélectionnés.
 */

/**
 * Composant Web pour l'upload de fichiers.
 *
 * @fires change - Déclenché lorsque la sélection de fichiers change.
 * @fires files-selected - Déclenché avec les détails des fichiers sélectionnés.
 * @element agi-file-upload
 */
@customElement('agi-file-upload')
export class AgiFileUpload extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: sans-serif;
    }

    .file-upload-container {
      border: 2px dashed #ccc;
      border-radius: 8px;
      padding: 20px;
      text-align: center;
      cursor: pointer;
      transition: border-color 0.3s ease;
    }

    .file-upload-container:hover,
    .file-upload-container.drag-over {
      border-color: #007bff;
    }

    input[type="file"] {
      display: none;
    }

    .upload-icon {
      font-size: 2em;
      color: #007bff;
      margin-bottom: 10px;
    }

    .file-list {
      margin-top: 15px;
      text-align: left;
      padding: 0;
      list-style: none;
    }

    .file-item {
      padding: 5px 0;
      border-bottom: 1px solid #eee;
      font-size: 0.9em;
      color: #333;
    }

    .file-item:last-child {
      border-bottom: none;
    }

    .label-text {
        color: #555;
        font-size: 1em;
    }
  `;

  /**
   * Spécifie les types de fichiers acceptés (ex: 'image/*', '.pdf').
   */
  @property({ type: String })
  accept: string = '';

  /**
   * Indique si l'utilisateur peut sélectionner plusieurs fichiers.
   */
  @property({ type: Boolean })
  multiple: boolean = false;

  /**
   * Le texte à afficher dans la zone de dépôt/clic.
   */
  @property({ type: String })
  labelText: string = 'Glissez et déposez des fichiers ici ou cliquez pour sélectionner';

  /**
   * La liste des fichiers actuellement sélectionnés.
   */
  @state()
  private selectedFiles: File[] = [];

  /**
   * Référence à l'élément input de type 'file'.
   */
  private fileInput: HTMLInputElement | null = null;

  /**
   * Le nombre de propriétés exposées par le composant.
   */
  private propsCount: number = 3; // accept, multiple, labelText

  render() {
    return html`
      <div
        class="file-upload-container"
        @click=${this.openFileSelector}
        @dragover=${this.handleDragOver}
        @dragleave=${this.handleDragLeave}
        @drop=${this.handleDrop}
      >
        <div class="upload-icon">⬆️</div>
        <div class="label-text">${this.labelText}</div>
        <input
          type="file"
          .accept=${this.accept}
          ?multiple=${this.multiple}
          @change=${this.handleFileChange}
          aria-label="Sélectionner des fichiers"
          tabindex="-1"
        />
      </div>

      ${this.selectedFiles.length > 0
        ? html`
            <ul class="file-list">
              ${this.selectedFiles.map(
                (file) => html`<li class="file-item">${file.name} (${this.formatBytes(file.size)})</li>`
              )}
            </ul>
          `
        : ''}
    `;
  }

  firstUpdated() {
    this.fileInput = this.shadowRoot!.querySelector('input[type="file"]');
  }

  /**
   * Ouvre le sélecteur de fichiers natif.
   */
  private openFileSelector() {
    this.fileInput?.click();
  }

  /**
   * Gère le changement de sélection de fichiers via l'input.
   * @param event L'événement de changement.
   */
  private handleFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.processFiles(input.files);
  }

  /**
   * Gère l'événement de glisser-déposer.
   * @param event L'événement de glisser-déposer.
   */
  private handleDrop(event: DragEvent) {
    event.preventDefault();
    const container = this.shadowRoot!.querySelector('.file-upload-container');
    container?.classList.remove('drag-over');

    if (event.dataTransfer) {
      this.processFiles(event.dataTransfer.files);
    }
  }

  /**
   * Gère l'événement de survol lors du glisser-déposer.
   * @param event L'événement de glisser-déposer.
   */
  private handleDragOver(event: DragEvent) {
    event.preventDefault();
    const container = this.shadowRoot!.querySelector('.file-upload-container');
    container?.classList.add('drag-over');
  }

  /**
   * Gère l'événement de sortie lors du glisser-déposer.
   * @param event L'événement de glisser-déposer.
   */
  private handleDragLeave(event: DragEvent) {
    const container = this.shadowRoot!.querySelector('.file-upload-container');
    container?.classList.remove('drag-over');
  }

  /**
   * Traite la liste des fichiers et déclenche les événements.
   * @param files La liste des fichiers à traiter.
   */
  private processFiles(files: FileList | null) {
    if (files && files.length > 0) {
      // Si 'multiple' est faux, on ne prend que le premier fichier
      const fileArray = this.multiple ? Array.from(files) : [files[0]];
      this.selectedFiles = fileArray;

      /** @type {FileUploadEventDetail} */
      const detail = { files: files };

      // Déclenche un événement 'change' standard
      this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));

      // Déclenche un événement personnalisé avec les fichiers
      this.dispatchEvent(
        new CustomEvent('files-selected', {
          detail,
          bubbles: true,
          composed: true,
        })
      );
    } else {
        this.selectedFiles = [];
        this.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    }
  }

  /**
   * Formate la taille en octets en une chaîne lisible.
   * @param bytes La taille en octets.
   * @param decimals Le nombre de décimales.
   * @returns La chaîne formatée.
   */
  private formatBytes(bytes: number, decimals: number = 2): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-file-upload': AgiFileUpload;
  }
}
