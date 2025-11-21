import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

/**
 * @typedef {'small' | 'medium' | 'large'} AvatarSize
 */

/**
 * Composant Web Component pour afficher un avatar (photo de profil).
 * Gère l'affichage d'une image avec un mécanisme de fallback.
 *
 * @element agi-avatar
 *
 * @property {string} src - L'URL de l'image de l'avatar.
 * @property {string} fallbackText - Le texte de remplacement (initiales) si l'image ne charge pas.
 * @property {AvatarSize} size - La taille de l'avatar ('small', 'medium', 'large').
 */
@customElement('agi-avatar')
export class AgiAvatar extends LitElement {
  static styles = css\`
    :host {
      display: inline-block;
      --avatar-size: 40px; /* Taille par défaut */
      --avatar-font-size: calc(var(--avatar-size) / 2.5);
    }

    .avatar-container {
      width: var(--avatar-size);
      height: var(--avatar-size);
      border-radius: 50%;
      overflow: hidden;
      background-color: #ccc; /* Couleur de fond pour le fallback */
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      font-weight: 600;
      user-select: none;
      transition: background-color 0.3s;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Tailles */
    :host([size="small"]) { --avatar-size: 32px; }
    :host([size="medium"]) { --avatar-size: 48px; }
    :host([size="large"]) { --avatar-size: 64px; }

    /* Styles pour le fallback */
    .fallback-text {
      font-size: var(--avatar-font-size);
    }
  \`;

  /**
   * L'URL de l'image de l'avatar.
   */
  @property({ type: String })
  src: string = '';

  /**
   * Le texte de remplacement (initiales) si l'image ne charge pas.
   */
  @property({ type: String, attribute: 'fallback-text' })
  fallbackText: string = 'AG';

  /**
   * La taille de l'avatar ('small', 'medium', 'large').
   */
  @property({ type: String, reflect: true })
  size: 'small' | 'medium' | 'large' = 'medium';

  /**
   * État interne pour suivre si l'image a échoué à charger.
   */
  @state()
  private _imageLoadFailed: boolean = false;

  /**
   * Réinitialise l'état de l'échec de chargement lorsque la source change.
   */
  willUpdate(changedProperties: Map<string | number | symbol, unknown>): void {
    if (changedProperties.has('src') && changedProperties.get('src') !== this.src) {
      this._imageLoadFailed = false;
    }
  }

  private _handleImageError() {
    this._imageLoadFailed = true;
  }

  private _renderContent() {
    if (this.src && !this._imageLoadFailed) {
      return html\`
        <img
          src=\${this.src}
          alt="Avatar"
          @error=\${this._handleImageError}
        />
      \`;
    }

    // Fallback: affiche le texte de remplacement
    return html\`
      <span class="fallback-text">\${this.fallbackText.substring(0, 2).toUpperCase()}</span>
    \`;
  }

  render() {
    return html\`
      <div class="avatar-container" role="img" aria-label="Avatar de \${this.fallbackText}">
        \${this._renderContent()}
      </div>
    \`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-avatar': AgiAvatar;
  }
}
