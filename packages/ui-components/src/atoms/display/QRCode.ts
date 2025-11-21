import { LitElement, html, css } from 'lit';
import { property, customElement } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import * as QRCode from 'qrcode';

/**
 * @component agi-qrcode
 * @description Composant Web Component pour générer un Code QR (QRCode) en SVG.
 * @category display
 * @tag agi-qrcode
 * @props_count 2
 *
 * @property {string} value - La donnée à encoder dans le Code QR.
 * @property {number} size - La taille du Code QR en pixels (largeur et hauteur).
 *
 * @example
 * <agi-qrcode value="https://www.manus.im" size="256"></agi-qrcode>
 */
@customElement('agi-qrcode')
export class AgiQrcode extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      line-height: 0; /* Empêche l'espace sous l'élément SVG */
    }
    svg {
      display: block;
    }
  `;

  /**
   * La donnée à encoder dans le Code QR.
   * @type {string}
   */
  @property({ type: String })
  value: string = '';

  /**
   * La taille du Code QR en pixels (largeur et hauteur).
   * @type {number}
   */
  @property({ type: Number })
  size: number = 256;

  /**
   * Génère la chaîne SVG du Code QR.
   * @returns {string} La chaîne SVG.
   */
  private _generateSvg(): string {
    if (!this.value) {
      return '';
    }

    try {
      // Utilise la bibliothèque qrcode pour générer le SVG
      const svgString = QRCode.create(this.value, {
        errorCorrectionLevel: 'M', // Niveau de correction d'erreur moyen
        type: 'svg',
        margin: 1, // Marge minimale
        color: {
          dark: '#000000ff', // Couleur des modules sombres
          light: '#ffffffff' // Couleur des modules clairs
        }
      }).toString();

      // Le SVG généré par la librairie n'inclut pas la taille, nous allons l'ajouter
      // et ajuster la viewBox pour correspondre à la taille demandée.
      // La librairie utilise une viewBox basée sur le nombre de modules.
      // Nous allons remplacer la balise <svg> pour inclure width, height et une viewBox correcte.
      const sizePx = `${this.size}px`;
      const finalSvg = svgString.replace(
        /<svg[^>]*>/,
        `<svg width="${sizePx}" height="${sizePx}" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">`
      );

      return finalSvg;

    } catch (err) {
      console.error('Erreur lors de la génération du Code QR:', err);
      return '';
    }
  }

  render() {
    const svgContent = this._generateSvg();
    // Utilisation de unsafeHTML pour injecter la chaîne SVG générée
    return html`${unsafeHTML(svgContent)}`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-qrcode': AgiQrcode;
  }
}
