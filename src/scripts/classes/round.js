import { Chart } from "./chart.js";
import { getRandomNumber, log } from "../utils.js";
import { Game } from "./game.js";

export class Round {
  // #ROUND_LOADING_TIME_MS = 0;
  #ROUND_LOADING_TIME_MS = 15000;
  #UPDATE_CHART_INTERVAL_TIME_MS = 125;
  #countToAdd;
  /**
   * @typedef {import('./chart.js').Chart} Chart
   * @type Chart
   */
  #chart;
  /**
   * @type HTMLElement
   */
  #imageMarkerAviatorEl;
  #isGameStarted = false;
  #isGameEnded = false;
  #multiplierCount = 1;

  get isGameStarted() {
    return this.#isGameStarted;
  }

  get isGameEnded() {
    return this.#isGameEnded;
  }

  get multiplierCount() {
    return this.#multiplierCount;
  }

  get loadingTime() {
    return this.#ROUND_LOADING_TIME_MS;
  }

  get intervalTime() {
    return this.#UPDATE_CHART_INTERVAL_TIME_MS;
  }

  constructor(chart) {
    this.#chart = chart;
    this.#imageMarkerAviatorEl = document.getElementById("aviator");
  }

  #generateRoundDurationAndNumberToAddCounter() {
    // máximo de segundos que a partida irá acontecer
    const ONE_SECOND_MS = 1000;
    const probability = getRandomNumber(1);
    let message = "";

    // Mapeamento de probabilidades para intervalos de duração
    const durationRanges = Game.RULES.GAME_PROBABILITY;

    // Encontrar o intervalo correspondente à probabilidade gerada
    // exemplo: 0.8 de probability
    // 0.8 < 0.6? -> vai pro próximo (0.8 < 0.8) -> cai aqui
    const selectedRange = durationRanges.find(
      (range) => probability <= range.probability
    );

    // Calcular a duração aleatória dentro do intervalo selecionado
    let roundDuration =
      getRandomNumber(selectedRange.maxDuration) * ONE_SECOND_MS +
      ONE_SECOND_MS;
    message = selectedRange.logMessage;
    let minimumNumberToAddCounter = selectedRange.minimumNumberToAddCounter;

    log("round", message);
    log(
      "start",
      `Essa partida durará ${(roundDuration / 1000).toFixed(2)} segundos.`
    );

    return {
      roundDuration: roundDuration,
      minimumNumberToAddCounter: minimumNumberToAddCounter,
    };
  }

  finishRound(timeoutId, intervalId) {
    // this.#imageMarkerAviatorEl.style.display = "none";
    setTimeout(() => {
      this.#imageMarkerAviatorEl.classList.add("fly-away");
      this.#imageMarkerAviatorEl.style.top = "0px";
      // console.log(window.screen.width);
      this.#imageMarkerAviatorEl.style.left = `${window.screen.width}px`;
    }, 100);
    this.#chart.setTitleFontColor("#dc2626"); // red 600
    this.#chart.setSubtitleText("Voou para longe!");

    // limpar os temporizadores
    clearTimeout(timeoutId);
    clearInterval(intervalId);
    this.#chart.shouldUpdateMarkerPositionAfterResize = false;
    this.#isGameStarted = false;
    this.#isGameEnded = true;
  }

  loadingNewRound() {
    this.#chart.setSubtitleText("A partida começará em instantes!");
    this.#chart.setTitleText("Faça sua aposta!");
    this.#chart.setTitleFontColor("white");
    this.#chart.setTitleFontSize(64);
  }

  awaitNewRound() {
    this.loadingNewRound();
    this.#chart.clearChartDps();
    this.#chart.render();
  }

  startNewRound() {
    const { roundDuration, minimumNumberToAddCounter } =
      this.#generateRoundDurationAndNumberToAddCounter();
    this.#countToAdd = getRandomNumber(0.05) + minimumNumberToAddCounter; // mínimo pode ser 0.01, o máximo pode 0.2

    log("info", `O contador pode aumentar em até ${this.#countToAdd}`);

    this.#isGameEnded = false;
    this.#isGameStarted = true;
    this.#multiplierCount = 1;
    this.#chart.setSubtitleText("");
    this.#chart.setTitleText("");
    this.#chart.setTitleFontSize(100);
    this.#chart.setTitleFontColor("#fff");
    this.#chart.shouldUpdateMarkerPositionAfterResize = true;

    // this.#imageMarkerAviatorEl.style.display = "block";
    this.#imageMarkerAviatorEl.classList.remove("fly-away");

    // Esse algoritmo irá atualizar o gráfico constantemente (a cada 0.125 ms) e o multiplicador
    const intervalId = this.#createIntervalToUpdateChart(this.#countToAdd);

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, roundDuration);

    setTimeout(() => {
      // função que termina a partida e "limpa" os temporizadores
      this.finishRound(timeoutId, intervalId);
    }, roundDuration);

    return { roundDuration };
  }

  #createIntervalToUpdateChart(valueToAddInXAxis) {
    const intervalId = setInterval(() => {
      this.#multiplierCount += getRandomNumber(this.#countToAdd);
      this.#chart.setTitleText(`${this.#multiplierCount.toFixed(2)}x`);
      this.#chart.updateChart(valueToAddInXAxis);
    }, this.#UPDATE_CHART_INTERVAL_TIME_MS);
    return intervalId;
  }
}
