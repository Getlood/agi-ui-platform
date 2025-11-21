import { LitElement, html, css } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import JsBarcode from 'jsbarcode';

/**
 * @tag agi-barcode
 * @summary Composant Web Component pour générer des codes-barres.
 * @category display
 *
 * @property {string} value - La valeur à encoder dans le code-barres.
 * @property {string} format - Le format du code-barres (ex: CODE128, EAN13).
 * @property {number} width - L'épaisseur des barres (en pixels).
 * @property {number} height - La hauteur du code-barres (en pixels).
 * @property {boolean} displayValue - Affiche la valeur encodée sous le code-barres.
 * @property {string} lineColor - La couleur des barres.
 * @property {string} background - La couleur de fond.
 * @property {number} margin - La marge autour du code-barres.
 *
 * @csspart svg - L'élément SVG contenant le code-barres.
 */
@customElement('agi-barcode')
export class AgiBarcode extends LitElement {
  static styles = css`
    :host {
      display: inline-block;
      line-height: 0;
    }
    svg {
      /* Styles de base pour le SVG */
      max-width: 100%;
      height: auto;
    }
    .error {
      color: red;
      font-family: sans-serif;
      padding: 10px;
      border: 1px solid red;
    }
  `;

  /**
   * La valeur à encoder dans le code-barres.
   * @type {string}
   */
  @property({ type: String })
  value: string = '';

  /**
   * Le format du code-barres (ex: CODE128, EAN13).
   * @type {string}
   */
  @property({ type: String })
  format: string = 'CODE128';

  /**
   * L'épaisseur des barres (en pixels).
   * @type {number}
   */
  @property({ type: Number })
  width: number = 2;

  /**
   * La hauteur du code-barres (en pixels).
   * @type {number}
   */
  @property({ type: Number })
  height: number = 100;

  /**
   * Affiche la valeur encodée sous le code-barres.
   * @type {boolean}
   */
  @property({ type: Boolean, attribute: 'display-value' })
  displayValue: boolean = true;

  /**
   * La couleur des barres.
   * @type {string}
   */
  @property({ type: String, attribute: 'line-color' })
  lineColor: string = '#000000';

  /**
   * La couleur de fond.
   * @type {string}
   */
  @property({ type: String })
  background: string = '#ffffff';

  /**
   * La marge autour du code-barres.
   * @type {number}
   */
  @property({ type: Number })
  margin: number = 10;

  @state()
  private _error: string | null = null;

  // Référence à l'élément SVG
  private svgElement: SVGElement | null = null;

  // Nombre de propriétés exposées
  private _propsCount: number = 7;

  // Métadonnées VLA (interprétation basée sur les besoins de documentation)
  private _vlaMetadata = {
    component_name: 'Barcode',
    tag_name: 'agi-barcode',
    category: 'display',
    props_count: this._propsCount,
  };

  // Méthode pour générer le code-barres
  private generateBarcode() {
    if (!this.value) {
      this._error = 'La valeur du code-barres ne peut pas être vide.';
      return;
    }

    if (this.svgElement) {
      try {
        JsBarcode(this.svgElement, this.value, {
          format: this.format,
          width: this.width,
          height: this.height,
          displayValue: this.displayValue,
          lineColor: this.lineColor,
          background: this.background,
          margin: this.margin,
        });
        this._error = null;
      } catch (e) {
        this._error = `Erreur de génération de code-barres: ${e instanceof Error ? e.message : String(e)}`;
        console.error(e);
      }
    }
  }

  // LitElement lifecycle hook: appelé après la première mise à jour
  protected firstUpdated() {
    this.svgElement = this.shadowRoot!.querySelector('svg');
    this.generateBarcode();
  }

  // LitElement lifecycle hook: appelé après chaque mise à jour
  protected updated(changedProperties: Map<string | number | symbol, unknown>) {
    // Régénérer le code-barres si une propriété pertinente a changé
    if (
      changedProperties.has('value') ||
      changedProperties.has('format') ||
      changedProperties.has('width') ||
      changedProperties.has('height') ||
      changedProperties.has('displayValue') ||
      changedProperties.has('lineColor') ||
      changedProperties.has('background') ||
      changedProperties.has('margin')
    ) {
      this.generateBarcode();
    }
  }

  render() {
    if (this._error) {
      return html`<div class="error">${this._error}</div>`;
    }

    // Le code-barres sera généré dans cet élément SVG par JsBarcode
    return html`<svg part="svg"></svg>`;
  }

  // Méthode pour obtenir les métadonnées VLA
  public getVlaMetadata() {
    return this._vlaMetadata;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'agi-barcode': AgiBarcode;
  }
}
