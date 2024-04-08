import { getRandomInt } from "./utils.js";

// source: https://canvasjs.com/forums/topic/can-you-provide-me-like-aviator-game-chart/
let dps = [];
let updateIntervalTime = 125;

let chart = new CanvasJS.Chart("chartContainer", {
  title: {
    text: "1.00x",
    dockInsidePlotArea: true,
    verticalAlign: "center",
    fontSize: 100,
  },
  theme: "dark2",
  backgroundColor: "#030712", //gray 950
  toolTip: {
    enabled: false,
  },
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
      // markerImageUrl: "./assets/aviator.svg",
      markerImageUrl: "./assets/aviator_icon.png",
      dataPoints: dps,
    },
  ],
});

let imageMarker = document.createElement("img");
imageMarker.setAttribute("id", "aviator");
imageMarker.setAttribute("src", chart.options.data[0].markerImageUrl);
imageMarker.setAttribute(
  "style",
  "display: none; height: 80px; width: 80px; object-fit: contain;"
);

document
  .querySelector("#chartContainer > .canvasjs-chart-container")
  .append(imageMarker);

chart.render();

let xVal = 0;
let yVal = 0;

// let randomNumberToSumYAxis = getRandomInt(0.05);
// console.log(`Número aleatório do cálculo: ${randomNumberToSumYAxis}`);

function updateChart() {
  // esse cálculo faz a impressão ddo avião cair
  // yVal = Math.log(xVal + 1) + Math.sin(xVal * randomNumberToSumYAxis);
  // yVal = Math.log(xVal + 1); // gráfico de log10()
  yVal = xVal ** 2; // gráfico exponencial
  // console.log(yVal);
  dps.push({ x: xVal, y: yVal });
  xVal++;
  chart.render();
  chart.axisY[0].set("maximum", yVal + 1);
  positionMarkerImage(chart.options.data[0].dataPoints.length - 1);
}

let imageMarkerAviator = document.getElementById("aviator");

function positionMarkerImage(index) {
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

let isRoundFinished = false;

function finishRound(timeoutId, intervalId) {
  // imageMarkerAviator.style.display = "none";
  imageMarkerAviator.classList.add("fly-away");
  imageMarkerAviator.style.top = "0px";
  // console.log(window.screen.width);
  imageMarkerAviator.style.left = `${window.screen.width}px`;

  // limpar os temporizadores
  clearTimeout(timeoutId);
  clearInterval(intervalId);
  dps = [];
  isRoundFinished = true;
}

function generateRoundDuration() {
  // máximo de segundos que a partida irá acontecer
  const ONE_SECOND = 1000;

  const probability = getRandomInt(1);
  let gameDuration = 0;

  if (probability < 0.6) {
    // 60% da partida durar até 10 segundos
    gameDuration = getRandomInt(10) * ONE_SECOND;
    console.log(`60% de chance! - a partida pode durar até 10 segundos`);
  } else if (probability < 0.9) {
    // 30% da partida durar até 50 segundos
    gameDuration = getRandomInt(50) * ONE_SECOND;
    console.log(`30% de chance! - a partida pode durar até 50 segundos`);
  } else {
    // 10% da partida durar até 300 segundos
    gameDuration = getRandomInt(300) * ONE_SECOND;
    console.log(`10% de chance! - a partida pode durar até 300 segundos`);
  }
  console.log(
    `Essa partida durará ${(gameDuration / 1000).toFixed(2)} segundos.`
  );
  return gameDuration;
}

function startNewRound() {
  chart.title.set("fontSize", 100);
  // imageMarkerAviator.style.display = "block";
  imageMarkerAviator.classList.remove("fly-away");
  let count = 1;

  // esse algoritmo irá atualizar o gráfico constantemente
  const intervalId = setInterval(() => {
    count += getRandomInt(0.05);
    chart.title.set("text", `${count.toFixed(2)}x`);
    updateChart();
  }, updateIntervalTime);

  const roundDuration = generateRoundDuration();

  const timeoutId = setTimeout(() => {
    clearInterval(intervalId);
  }, roundDuration); // ou definir como 10000 -> 10 segundos

  // função que atualiza a localização do ícone do aviãozinho caso o usuário redimensione a tela
  window.addEventListener("resize", () => {
    if (isRoundFinished == false) {
      positionMarkerImage(chart.options.data[0].dataPoints.length - 1);
    }
  });

  setTimeout(() => {
    // função que termina a partida e "limpa" os temporizadores
    finishRound(timeoutId, intervalId);
  }, roundDuration);
}

function loadingNewRound() {
  chart.title.set("text", "A partida começará em instantes!");
  chart.title.set("fontSize", 32);
}

loadingNewRound();

setTimeout(() => {
  startNewRound();
}, 2000);
