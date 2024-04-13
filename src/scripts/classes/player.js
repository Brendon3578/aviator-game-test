console.log(
  "%cBrendon desenvolveu isso. ☕",
  [
    "color: #ED1836;",
    "font-size: 16px;",
    "font-weight: bold;",
    "padding: 10px 16px;",
    "background-color: #0f1923;",
    "border-radius: 8px;",
    "border: 1px solid #333",
  ].join("")
);

import { Bet } from "./bet.js";

export class Player {
  #money;
  #playerMoneyTextEl = document.getElementById("player-money");
  /**
   * @type { Bet[] }
   */
  #bets = [];

  constructor() {
    this.#bets.push(new Bet(1));
    this.#bets.push(new Bet(2));
  }

  get money() {
    return this.#money;
  }

  get playersBets() {
    return this.#bets.filter((bet) => {
      return bet.hasBet == true;
    });
  }

  setMoney(newMoney) {
    if (isNaN(newMoney)) throw new Error("Money to be set is not a number!");
    this.#money = newMoney;
  }

  winMoney(winnedMoney) {
    this.setMoney(this.#money + winnedMoney);
    this.updateMoneyOnInterface();
  }
  loseMoney(lostMoney) {
    this.setMoney(this.#money - lostMoney);
    this.updateMoneyOnInterface();
  }

  updateMoneyOnInterface() {
    this.#playerMoneyTextEl.innerText = this.money.toFixed(2);
  }

  setBetValue(betId, betValue) {
    let bet = this.#getBet(betId);
    if (bet) {
      bet.toBet(betValue);
    }
  }

  getBetValue(betId) {
    let bet = this.#getBet(betId);
    if (bet) {
      return bet.value;
    }
  }

  cancelBet(betId) {
    let bet = this.#getBet(betId);
    if (bet) {
      bet.cancelBet();
    }
  }

  loseBetsDone() {
    this.#bets.forEach((bet) => {
      if (bet.status == "bet") {
        bet.loseBet();
      }
    });
  }

  getLostBets() {
    return this.#bets.filter((bet) => bet.status == "lose");
  }

  #getBet(betId) {
    return this.#bets.find((bet) => bet.id == betId);
  }

  winBet(betId) {
    let betToUpdate = this.#getBet(betId);
    if (betToUpdate) {
      betToUpdate.winBet();
    }
  }
}
