import { elementExists, log } from "../utils.js";
import { Bet } from "./bet.js";

/**
 * Classe que representa o jogador dentro do jogo aviator.
 *
 * Essa classe foi feita para centralizar os métodos de apostas do jogador.
 * E poder controlar o dinheiro que é utilizado dentro do jogo.
 */
export class Player {
  /**
   * @type {number} Variável privada para armazenar o dinheiro do jogador.
   */
  #money;
  /**
   * Elemento da interface do usuário para exibir o dinheiro do jogador.
   * @type { HTMLElement }
   */
  #playerMoneyTextEl = document.getElementById("player-money");
  /**
   * Array privado de apostas feitas pelo jogador.
   * @type { Bet[] }
   */
  #bets = [];

  /**
   * Construtor da classe Player.
   * Inicializa as classes de apostas do jogador e define o ID para elas.
   * E define o elemento que atualizará o dinheiro do jogador.
   */
  constructor() {
    let playerMoneyTextEl = document.getElementById("player-money");
    if (elementExists(this.#playerMoneyTextEl) == false)
      throw new Error("Element to update player money don't exists!");

    this.#playerMoneyTextEl = playerMoneyTextEl;
    this.#bets.push(new Bet(1));
    this.#bets.push(new Bet(2));
  }

  /**
   * Getter para obter o dinheiro do jogador.
   * @returns {number} O dinheiro do jogador.
   */
  get money() {
    return this.#money;
  }

  /**
   * Getter para obter as apostas ativas do jogador.
   * @returns {Bet[]} As apostas ativas do jogador.
   */
  get playersBets() {
    return this.#bets.filter((bet) => {
      return bet.hasBet == true;
    });
  }

  /**
   * Método privado para definir o dinheiro do jogador.
   * @param {number} newMoney O novo valor do dinheiro do jogador.
   * @throws {Error} Se o novo dinheiro não for um número.
   */
  #setMoney(newMoney) {
    if (isNaN(newMoney))
      throw new Error(`Money to be changed is not a number!: ${newMoney}`);

    this.#saveMoneyInStorage(newMoney);
    this.#money = newMoney;
  }

  /**
   * Método privado para salvar o dinheiro do jogador no local storage do navegador.
   * @param {number} money O dinheiro do jogador a ser salvo.
   */
  #saveMoneyInStorage(money) {
    window.localStorage.setItem(
      "player-money",
      JSON.stringify({ money: money })
    );
  }

  /**
   * Carrega o dinheiro do jogador do localStorage do navegador.
   */
  loadMoneyFromStorage() {
    let moneyObject = JSON.parse(window.localStorage.getItem("player-money"));
    if (moneyObject != null) {
      this.#setMoney(moneyObject.money);

      log("storage", "Dinheiro do jogador foi carregado do localStorage!");
      return;
    }

    this.#saveMoneyInStorage(100);
    this.#setMoney(100);
    log("storage", "Dinheiro do jogador foi definido no localStorage!");
    return;
  }

  /**
   * Adiciona dinheiro ganho ao dinheiro do jogador.
   * E atualiza a interface do usuário.
   * @param {number} winnedMoney O dinheiro ganho.
   */
  winMoney(winnedMoney) {
    this.#setMoney(this.#money + winnedMoney);
    this.updateMoneyOnInterface();
  }

  /**
   * Remove dinheiro perdido do dinheiro do jogador.
   * E atualiza a interface do usuário.
   * @param {number} lostMoney O dinheiro perdido.
   */
  loseMoney(lostMoney) {
    this.#setMoney(this.#money - lostMoney);
    this.updateMoneyOnInterface();
  }

  /**
   * Atualiza o elemento da interface visual do usuário que mostra o dinheiro do jogador.
   */
  updateMoneyOnInterface() {
    this.#playerMoneyTextEl.innerText = this.money.toFixed(2);
  }

  /**
   * Define o valor de uma aposta com o ID da aposta.
   * @param {number} betId O ID da aposta.
   * @param {number} betValue O valor da aposta.
   */
  setBetValue(betId, betValue) {
    let bet = this.#getBet(betId);
    if (bet) {
      bet.toBet(betValue);
    }
  }

  /**
   * Obtém o valor de uma aposta a partir do ID da aposta.
   * @param {number} betId O ID da aposta.
   * @returns {number} O valor da aposta.
   */
  getBetValue(betId) {
    let bet = this.#getBet(betId);
    if (bet) {
      return bet.value;
    }
  }

  /**
   * Cancela uma aposta a partir do ID da aposta feita .
   * @param {number} betId O ID da aposta.
   */
  cancelBet(betId) {
    let bet = this.#getBet(betId);
    if (bet) {
      bet.cancelBet();
    }
  }

  /**
   * Perde todas as apostas feitas pelo jogador.
   */
  loseBetsDone() {
    this.#bets.forEach((bet) => {
      if (bet.status == "bet") {
        bet.loseBet();
      }
    });
  }

  /**
   * Obtém as apostas perdidas pelo jogador.
   * @returns {Bet[]} As apostas perdidas pelo jogador.
   */
  getLostBets() {
    return this.#bets.filter((bet) => bet.status == "lose");
  }

  /**
   * Obtém uma aposta pelo ID.
   * @param {number} betId O ID da aposta.
   * @returns {Bet} A aposta encontrada.
   */
  #getBet(betId) {
    return this.#bets.find((bet) => bet.id == betId);
  }

  /**
   * Ganha uma aposta feita pelo jogador.
   * @param {number} betId O ID da aposta.
   */
  winBet(betId) {
    let betToUpdate = this.#getBet(betId);
    if (betToUpdate) {
      betToUpdate.winBet();
    }
  }

  hasEnoughMoney(moneyToCompare) {
    return moneyToCompare > this.money;
  }
}
