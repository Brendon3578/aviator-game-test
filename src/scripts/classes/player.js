import { Bet } from "./bet.js";

class Player {
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
    this.#money = newMoney;
  }

  winMoney(winnedMoney) {
    this.#money += winnedMoney;
    this.updateMoneyOnInterface();
    // console.log(this.money);
  }
  loseMoney(lostMoney) {
    this.#money -= lostMoney;
    this.updateMoneyOnInterface();
    // console.log(this.money);
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

export { Player };
