import { buildChartConfiguration } from "./config/chart.config.js";

class Chart {
  chartInterface;
  dps = [];
  xVal = 0;
  yVal = 0;
  imageMarker = document.createElement("img");
  shouldUpdateMarkerPositionAfterResize = true;

  constructor() {
    this.chartInterface = new CanvasJS.Chart(
      "chartContainer",
      buildChartConfiguration(this.dps)
    );

    this.imageMarker.setAttribute("id", "aviator");
    this.imageMarker.setAttribute(
      "src",
      this.chartInterface.options.data[0].markerImageUrl
    );
    this.imageMarker.setAttribute(
      "style",
      "display: none; height: 80px; width: 80px; object-fit: contain;"
    );

    document
      .querySelector("#chartContainer > .canvasjs-chart-container")
      .append(this.imageMarker);
  }

  render() {
    this.chartInterface.render();
    this.addMarkerResizeEvent();
  }

  // função que atualiza a localização do ícone do aviãozinho caso o usuário redimensione a tela
  addMarkerResizeEvent() {
    window.addEventListener("resize", () => {
      if (this.shouldUpdateMarkerPositionAfterResize) {
        this.updateMarkerPosition(
          this.chartInterface.options.data[0].dataPoints.length - 1
        );
      }
    });
  }

  updateMarkerPosition(index) {
    let pixelX = this.chartInterface.axisX[0].convertValueToPixel(
      this.chartInterface.options.data[0].dataPoints[index].x
    );
    let pixelY = this.chartInterface.axisY[0].convertValueToPixel(
      this.chartInterface.options.data[0].dataPoints[index].y
    );

    let imageWidth = parseInt(this.imageMarker.style.width, 10);
    let imageHeight = parseInt(this.imageMarker.style.height, 10);

    this.imageMarker.style.position = "absolute";
    this.imageMarker.style.display = "block";
    this.imageMarker.style.top = `${pixelY - imageHeight / 2}px`;
    this.imageMarker.style.left = `${pixelX - imageWidth / 2}px`;

    // imageMarker.css({
    //   position: "absolute",
    //   display: "block",
    //   top: pixelY - imageMarker.height() / 2,
    //   left: pixelX - imageMarker.width() / 2,
    // });
  }

  updateChart() {
    // esse cálculo faz a impressão ddo avião cair
    // yVal = Math.log(xVal + 1) + Math.sin(xVal * randomNumberToSumYAxis);
    // yVal = Math.log(xVal + 1); // gráfico de log10()
    // this.yVal = Math.sin(this.xVal) + this.xVal; // gráfico de ondulação + crescente
    this.yVal = this.xVal ** 2; // gráfico exponencial

    // console.log(yVal);
    this.dps.push({ x: this.xVal, y: this.yVal });
    this.xVal++;
    this.chartInterface.render();
    this.chartInterface.axisY[0].set("maximum", this.yVal + 1);
    this.updateMarkerPosition(
      this.chartInterface.options.data[0].dataPoints.length - 1
    );
  }

  setTitleFontColor(color) {
    this.chartInterface.title.set("fontColor", color);
  }
  setSubtitleText(text) {
    this.chartInterface.subtitles[0].set("text", text);
  }
  setTitleText(text) {
    this.chartInterface.title.set("text", text);
  }
  setTitleFontSize(size) {
    this.chartInterface.title.set("fontSize", size);
  }

  clearChartDps() {
    this.dps = [];
  }
}

export { Chart };
