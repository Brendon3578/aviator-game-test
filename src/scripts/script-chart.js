import { Chart } from "./chart.js";
import { getRandomInt } from "./utils.js";

// source: https://canvasjs.com/forums/topic/can-you-provide-me-like-aviator-game-chart/
let updateIntervalTime = 125;

let chart = new Chart();
chart.render();

let imageMarkerAviator = document.getElementById("aviator");

function finishRound(timeoutId, intervalId) {
  // imageMarkerAviator.style.display = "none";
  imageMarkerAviator.classList.add("fly-away");
  imageMarkerAviator.style.top = "0px";
  // console.log(window.screen.width);
  imageMarkerAviator.style.left = `${window.screen.width}px`;
  chart.setTitleFontColor("#dc2626"); // red 600
  chart.setSubtitleText("Voou para longe!");

  // limpar os temporizadores
  clearTimeout(timeoutId);
  clearInterval(intervalId);
  chart.clearChartDps();
  chart.shouldUpdateMarkerPositionAfterResize = false;
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
  chart.setSubtitleText("");
  chart.setTitleText("");
  chart.setTitleFontSize(100);
  chart.setTitleFontColor("#fff");
  chart.shouldUpdateMarkerPositionAfterResize = true;

  // imageMarkerAviator.style.display = "block";
  imageMarkerAviator.classList.remove("fly-away");
  let count = 1;

  // esse algoritmo irá atualizar o gráfico constantemente
  const intervalId = setInterval(() => {
    count += getRandomInt(0.05);
    chart.setTitleText(`${count.toFixed(2)}x`);
    chart.updateChart();
  }, updateIntervalTime);

  // ou definir como 10000 -> 10 segundos
  const roundDuration = generateRoundDuration();

  const timeoutId = setTimeout(() => {
    clearInterval(intervalId);
  }, roundDuration);

  setTimeout(() => {
    // função que termina a partida e "limpa" os temporizadores
    finishRound(timeoutId, intervalId);
  }, roundDuration);
}

function loadingNewRound() {
  chart.setSubtitleText("");
  chart.setTitleText("A partida começará em instantes!");
  chart.setTitleFontSize(32);
}

loadingNewRound();

setTimeout(() => {
  startNewRound();
}, 2000);
