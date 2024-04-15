import { Chart } from "./chart.js";
import { getRandomNumber, log } from "../utils.js";

export class Round {
  // #ROUND_LOADING_TIME_MS = 0;
  #ROUND_LOADING_TIME_MS = 10000;
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

  #generateRoundDuration() {
    // máximo de segundos que a partida irá acontecer
    const ONE_SECOND_MS = 1000;
    const probability = getRandomNumber(1);
    let gameDuration = 0;
    let message = "";

    // Mapeamento de probabilidades para intervalos de duração
    const durationRanges = [
      {
        probability: 0.6,
        maxDuration: 10,
        message: "60% - a partida pode durar até 10 segundos",
      },
      {
        probability: 0.9,
        maxDuration: 50,
        message: "30% - a partida pode durar até 50 segundos",
      },
      {
        probability: 1,
        maxDuration: 300,
        message: "10% - a partida pode durar até 300 segundos",
      },
    ];

    // Encontrar o intervalo correspondente à probabilidade gerada
    // exemplo: 0.8 de probability
    // 0.8 < 0.6? -> vai pro próximo (0.8 < 0.8) -> cai aqui
    const selectedRange = durationRanges.find(
      (range) => probability < range.probability
    );

    // Calcular a duração aleatória dentro do intervalo selecionado
    gameDuration = getRandomNumber(selectedRange.maxDuration) * ONE_SECOND_MS;
    message = selectedRange.message;

    log("round", message);
    log(
      "start",
      `Essa partida durará ${(gameDuration / 1000).toFixed(2)} segundos.`
    );

    return gameDuration;
  }

  finishRound(timeoutId, intervalId) {
    // this.#imageMarkerAviatorEl.style.display = "none";
    this.#imageMarkerAviatorEl.classList.add("fly-away");
    this.#imageMarkerAviatorEl.style.top = "0px";
    // console.log(window.screen.width);
    this.#imageMarkerAviatorEl.style.left = `${window.screen.width}px`;
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
    this.#chart.setSubtitleText("Faça sua aposta!");
    this.#chart.setTitleText("A partida começará em instantes!");
    this.#chart.setTitleFontColor("white");
    this.#chart.setTitleFontSize(40);
  }

  awaitNewRound() {
    this.loadingNewRound();
    this.#chart.clearChartDps();
    this.#chart.render();
  }

  startNewRound() {
    this.#countToAdd = getRandomNumber(0.2) + 0.05; // min: 0.06, max: 0.25
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
    const intervalId = this.#createIntervalToUpdateChart();

    // ou definir como 10000 -> 10 segundos
    const roundDuration = this.#generateRoundDuration();

    const timeoutId = setTimeout(() => {
      clearInterval(intervalId);
    }, roundDuration);

    setTimeout(() => {
      // função que termina a partida e "limpa" os temporizadores
      this.finishRound(timeoutId, intervalId);
    }, roundDuration);

    return { roundDuration };
  }

  #createIntervalToUpdateChart() {
    const intervalId = setInterval(() => {
      this.#multiplierCount += getRandomNumber(this.#countToAdd);
      this.#chart.setTitleText(`${this.#multiplierCount.toFixed(2)}x`);
      this.#chart.updateChart();
    }, this.#UPDATE_CHART_INTERVAL_TIME_MS);
    return intervalId;
  }
}
