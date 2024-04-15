import { Chart } from "./chart.js";
import { Round } from "./round.js";
import { Player } from "./player.js";

export class Game {
  /**
   * @type { Player }
   */
  #player;
  /**
   * @type { Round}
   */
  #round;
  /**
   * @type { Chart }
   */
  #chart;

  constructor(player, round, chart) {
    //injeção de dependência
    this.#player = player;
    this.#round = round;
    this.#chart = chart;
  }

  build() {
    this.#chart.render();
    this.#round.loadingNewRound();
    this.#player.loadMoneyFromStorage();
    this.#player.updateMoneyOnInterface();
  }

  async init(gameFunction) {
    await gameFunction();
    await this.init(gameFunction);
  }
}
