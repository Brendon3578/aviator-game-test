import { Chart } from "./chart.js";
import { getRandomInt } from "../utils.js";

export class Round {
  // #roundLoadingTimeMS = 0;
  #roundLoadingTimeMS = 10000;
  #updateChartIntervalTimeMS = 125;
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
    return this.#roundLoadingTimeMS;
  }

  get intervalTime() {
    return this.#updateChartIntervalTimeMS;
  }

  constructor(chart) {
    this.#chart = chart;
    this.#countToAdd = getRandomInt(0.07) + 0.03;
    console.log(`O contador pode aumentar em até ${this.#countToAdd}`);
    this.#imageMarkerAviatorEl = document.getElementById("aviator");
  }

  #generateRoundDuration() {
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
    // gameDuration = 10000;
    console.log(
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
    this.#chart.clearChartDps();
    this.#chart.shouldUpdateMarkerPositionAfterResize = false;
    this.#isGameStarted = false;
    this.#isGameEnded = true;
  }

  loadingNewRound() {
    this.#chart.setSubtitleText("Faça sua aposta!");
    this.#chart.setTitleText("A partida começará em instantes!");
    this.#chart.setTitleFontSize(40);
  }

  startNewRound() {
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
      this.#multiplierCount += getRandomInt(this.#countToAdd);
      this.#chart.setTitleText(`${this.#multiplierCount.toFixed(2)}x`);
      this.#chart.updateChart();
    }, this.#updateChartIntervalTimeMS);
    return intervalId;
  }
}
