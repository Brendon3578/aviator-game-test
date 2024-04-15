import { buildChartConfiguration } from "../config/chart.config.js";
import { elementExists } from "../utils.js";

export class Chart {
  /**
   * Objeto que representa um ponto de dados.
   * @typedef {Object} DataPoint
   * @property {number} x - O valor do eixo x.
   * @property {string} y - O valor do eixo y.
   */

  /**
   * Interface do gráfico.
   */
  #chartInterface;
  /**
   * Array de pontos de dados do gráfico.
   * @type {Array<DataPoint>}
   */
  dps = [];
  /**
   * Valor de x atual.
   * @type {number}
   */
  #xVal = 0;

  /**
   * Valor de y atual.
   * @type {number}
   */
  #yVal = 0;
  /**
   * Elemento de imagem para o marcador.
   * @type {HTMLImageElement}
   */
  #imageMarker;

  /**
   * Indica se a posição do marcador deve ser atualizada após o redimensionamento da página.
   * @type {boolean}
   */
  shouldUpdateMarkerPositionAfterResize = false;

  constructor() {
    this.#chartInterface = new CanvasJS.Chart(
      "chartContainer",
      buildChartConfiguration(this.dps)
    );

    this.#imageMarker = document.createElement("img");
    this.#imageMarker.id = "aviator";
    this.#imageMarker.src = this.#chartInterface.options.data[0].markerImageUrl;
    this.#imageMarker.setAttribute(
      "style",
      "display: none; height: 80px; width: 80px; object-fit: contain;"
    );

    // document
    //   .querySelector("#chartContainer > .canvasjs-chart-container")
    //   .append(this.#imageMarker);

    const chartContainer = document.querySelector(
      "#chartContainer > .canvasjs-chart-container"
    );

    if (elementExists(chartContainer) == false)
      throw new Error("Chart container element not found.");

    chartContainer.append(this.#imageMarker);
  }

  /**
   * Renderiza o gráfico.
   */
  render() {
    this.#chartInterface.render();
    this.#addMarkerResizeEvent();
  }

  /**
   * Adiciona um evento de redimensionamento para atualizar a posição do marcador.
   */
  #addMarkerResizeEvent() {
    // -- Função que atualiza a posição do ícone do aviãozinho caso o usuário redimensione a tela
    window.addEventListener("resize", () => {
      if (this.shouldUpdateMarkerPositionAfterResize) {
        this.updateMarkerPosition(
          this.#chartInterface.options.data[0].dataPoints.length - 1
        );
      }
    });
  }
  /**
   * Atualiza a posição do marcador.
   * @param {number} index - Índice do ponto de dados.
   * @private
   */
  updateMarkerPosition(index) {
    let pixelX = this.#chartInterface.axisX[0].convertValueToPixel(
      this.#chartInterface.options.data[0].dataPoints[index].x
    );
    let pixelY = this.#chartInterface.axisY[0].convertValueToPixel(
      this.#chartInterface.options.data[0].dataPoints[index].y
    );

    let imageWidth = parseInt(this.#imageMarker.style.width, 10);
    let imageHeight = parseInt(this.#imageMarker.style.height, 10);

    this.#imageMarker.style.position = "absolute";
    this.#imageMarker.style.display = "block";
    this.#imageMarker.style.top = `${pixelY - imageHeight / 2}px`;
    this.#imageMarker.style.left = `${pixelX - imageWidth / 2}px`;
  }

  /**
   * Atualiza o gráfico em tempo real.
   */
  updateChart() {
    this.#yVal = this.#xVal ** 2; // Gráfico exponencial

    // #yVal = Math.log(#xVal + 1) + Math.sin(#xVal * randomNumberToSumYAxis);
    // #yVal = Math.log(#xVal + 1); // gráfico de log10() sem aparecer o número negativo
    // this.#yVal = Math.sin(this.#xVal) + this.#xVal; // gráfico de ondulação + crescente
    this.dps.push({ x: this.#xVal, y: this.#yVal });
    this.#xVal++;
    this.#chartInterface.render();
    this.#chartInterface.axisY[0].set("maximum", this.#yVal + 1);
    this.updateMarkerPosition(
      this.#chartInterface.options.data[0].dataPoints.length - 1
    );
  }

  /**
   * Define a cor da fonte do título do gráfico.
   * @param {string} color - Cor da fonte.
   */
  setTitleFontColor(color) {
    this.#chartInterface.title.set("fontColor", color);
  }
  /**
   * Define o texto do subtítulo do gráfico.
   * @param {string} text - Texto do subtítulo.
   */
  setSubtitleText(text) {
    this.#chartInterface.subtitles[0].set("text", text);
  }
  /**
   * Define o texto do título do gráfico.
   * @param {string} text - Texto do título.
   */
  setTitleText(text) {
    this.#chartInterface.title.set("text", text);
  }
  /**
   * Define o tamanho da fonte do título do gráfico.
   * @param {number} size - Tamanho da fonte.
   */
  setTitleFontSize(size) {
    this.#chartInterface.title.set("fontSize", size);
  }

  /**
   * Limpa os pontos de dados do gráfico.
   */
  clearChartDps() {
    this.#chartInterface.options.data[0].dataPoints = [];
    this.dps = [];
    this.#chartInterface.options.data[0].dataPoints = this.dps;
    this.#xVal = 0;
    this.#yVal = 0;
  }
}
