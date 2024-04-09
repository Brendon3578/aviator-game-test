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

  init() {
    this.#chart.render();
    this.#round.loadingNewRound();
    this.#player.setMoney(100);
    this.#player.updateMoneyOnInterface();
  }
}
