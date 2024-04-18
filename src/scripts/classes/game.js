import { Chart } from "./chart.js";
import { Round } from "./round.js";
import { Player } from "./player.js";

/**
 * Classe que representa uma instância do jogo.
 * @class
 */
export class Game {
  /**
   * Regras gerais ddo jogo
   */
  static RULES = {
    MINIMUM_VALUE_TO_BET: 1,
    GAME_PROBABILITY: [
      {
        probability: 0.7,
        maxDuration: 10,
        logMessage: "70% - a partida pode durar até 10 segundos",
        minimumNumberToAddCounter: 0.01,
      },
      {
        probability: 0.95,
        maxDuration: 50,
        logMessage: "25% - a partida pode durar até 50 segundos",
        minimumNumberToAddCounter: 0.05,
      },
      {
        probability: 1,
        maxDuration: 250,
        logMessage: "5% - a partida pode durar até 250 segundos",
        minimumNumberToAddCounter: 0.15,
      },
    ],
  };

  /**
   * Instância do jogador.
   * @type {Player}
   * @private
   */
  #player;

  /**
   * Instância do round.
   * @type {Round}
   * @private
   */
  #round;
  /**
   * Instância do gráfico.
   * @type {Chart}
   * @private
   */
  #chart;

  /**
   * Cria uma nova instância de Game.
   * @param {Player} player - Instância do jogador.
   * @param {Round} round - Instância do round.
   * @param {Chart} chart - Instância do gráfico.
   */
  constructor(player, round, chart) {
    //injeção de dependência
    this.#player = player;
    this.#round = round;
    this.#chart = chart;
  }

  /**
   * Constrói o jogo inicializando os elementos necessários.
   */
  build() {
    // Renderiza o gráfico
    this.#chart.render();
    // Mostra em tela a interface de carregamento
    this.#round.loadingNewRound();
    // Carrega o dinheiro do jogador do localStorage
    this.#player.loadMoneyFromStorage();
    // Atualiza a interface do usuário com o dinheiro do jogador
    this.#player.updateMoneyOnInterface();
  }

  /**
   * Inicializa o jogo em um loop infinito.
   * @param {Function} gameFunction - Função que executa o jogo.
   * @returns {Promise<void>} - Promessa que representa o processo de inicialização.
   */
  async init(gameFunction) {
    await gameFunction();
    await this.init(gameFunction);
  }
}
