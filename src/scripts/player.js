class Player {
  #money;
  #playerMoneyTextEl = document.getElementById("player-money");
  #betValues = [];

  constructor() {
    this.#betValues.push({
      index: 1,
      hasBet: false,
      betValue: 0,
    });
    this.#betValues.push({
      index: 2,
      hasBet: false,
      betValue: 0,
    });
  }

  get playersBets() {
    return this.#betValues.filter((bet) => {
      return bet.hasBet == true;
    });
  }

  setBetValue(betNumber, betValue) {
    if (this.#verifyIfBetExists(betNumber - 1)) {
      this.#betValues[betNumber - 1].betValue = betValue;
      this.#betValues[betNumber - 1].hasBet = true;
    }
  }

  cancelBet(betNumber) {
    if (this.#verifyIfBetExists(betNumber - 1)) {
      this.#betValues[betNumber - 1].betValue = 0;
      this.#betValues[betNumber - 1].hasBet = false;
    }
  }

  #verifyIfBetExists(index) {
    return this.#betValues[index] ? true : false;
  }

  getMoney() {
    return this.#money;
  }

  setMoney(newMoney) {
    this.#money = newMoney;
  }

  updateMoneyOnInterface() {
    this.#playerMoneyTextEl.innerText = this.getMoney().toFixed(2);
  }
}

export { Player };
