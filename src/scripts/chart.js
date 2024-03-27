import { getRandomInt } from "./utils.js";

// source: https://canvasjs.com/forums/topic/can-you-provide-me-like-aviator-game-chart/
let dps = [];
let updateInterval = 125;

let chart = new CanvasJS.Chart("chartContainer", {
  title: {
    text: "4.03x",
    dockInsidePlotArea: true,
    verticalAlign: "center",
    fontSize: 100,
  },
  theme: "dark2",
  backgroundColor: "#030712", //gray 950
  axisX: {
    lineColor: "#4b5563", //gray 600
    labelFontColor: "#4b5563", //gray 600
    gridThickness: 0,
    tickLength: 0,
    labelFontSize: 20,
    labelFormatter: (e) => ".",
  },
  axisY: {
    lineColor: "#4b5563", //gray 600
    labelFontColor: "#ed1836", //gray 600
    gridThickness: 0,
    tickLength: 0,
    margin: 10,
    lineThickness: 1,
    labelFontSize: 20,
    labelFormatter: (e) => ".",
  },
  data: [
    {
      color: "#ed1836",
      markerSize: 0,
      fillOpacity: 0.3,
      lineThickness: 4,
      type: "area",
      markerImageUrl: "./assets/aviator.svg",
      dataPoints: dps,
    },
  ],
});

let imageMarker = document.createElement("img");
imageMarker.setAttribute("id", "aviator");
imageMarker.setAttribute("src", chart.options.data[0].markerImageUrl);
imageMarker.setAttribute("style", "display: none; height: 80px; width: 80px");
// `<img id='aviator' src="${chart.options.data[0].markerImageUrl}" style="display: none; height: 20px; width: 20px" />`;
document
  .querySelector("#chartContainer > .canvasjs-chart-container")
  .append(imageMarker);
// $("<img>")
//   .attr("src", chart.options.data[0].markerImageUrl)
//   .css("display", "none")
//   .css("height", 20)
//   .css("width", 20)
//   .appendTo($("#chartContainer>.canvasjs-chart-container"));

chart.render();

let xVal = 0;
let yVal = 0;

function updateChart() {
  yVal = Math.log(xVal + 3); // gráfico de log10()
  // yVal = xVal ** 2; // gráfico exponencial
  dps.push({ x: xVal, y: yVal });
  xVal++;
  chart.render();
  chart.axisY[0].set("maximum", yVal + 1);
  positionMarkerImage(imageMarker, chart.options.data[0].dataPoints.length - 1);
}

let imageMarkerAviator = document.getElementById("aviator");

function positionMarkerImage(imageMarker, index) {
  let pixelX = chart.axisX[0].convertValueToPixel(
    chart.options.data[0].dataPoints[index].x
  );
  let pixelY = chart.axisY[0].convertValueToPixel(
    chart.options.data[0].dataPoints[index].y
  );

  let imageWidth = parseInt(imageMarkerAviator.style.width, 10);
  let imageHeight = parseInt(imageMarkerAviator.style.height, 10);

  imageMarkerAviator.style.position = "absolute";
  imageMarkerAviator.style.display = "block";
  imageMarkerAviator.style.top = `${pixelY - imageHeight / 2}px`;
  imageMarkerAviator.style.left = `${pixelX - imageWidth / 2}px`;

  // imageMarker.css({
  //   position: "absolute",
  //   display: "block",
  //   top: pixelY - imageMarker.height() / 2,
  //   left: pixelX - imageMarker.width() / 2,
  // });
}

let count = 1;

let updateId = setInterval(() => {
  count += getRandomInt(0.05);
  chart.title.set("text", `${count.toFixed(2)}x`);
  updateChart();
}, updateInterval);

// máximo de segundos que a partia irá acontecer
const ONE_SECOND = 1000;
const roundDuration = getRandomInt(20) * ONE_SECOND;
console.log(
  `Essa partida acontecera durante ${(roundDuration / 1000).toFixed(
    2
  )} segundos.`
);

setTimeout(() => {
  clearInterval(updateId);
}, roundDuration); // ou definir como 10000 -> 10 segundos

window.addEventListener("resize", () => {
  positionMarkerImage(imageMarker, chart.options.data[0].dataPoints.length - 1);
});
