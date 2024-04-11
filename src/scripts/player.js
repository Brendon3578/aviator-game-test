class Player {
  #money;
  #playerMoneyTextEl = document.getElementById("player-money");
  #betValues = [];

  constructor() {
    this.#betValues.push({
      index: 1,
      hasBet: false,
      betValue: 0,
      status: "wait" /* wait ou lose ou win ou bet */,
    });
    this.#betValues.push({
      index: 2,
      hasBet: false,
      betValue: 0,
      status: "wait" /* wait ou lose ou win ou bet */,
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
      this.#betValues[betNumber - 1].status = "bet";
    }
  }

  getBetValue(betNumber) {
    if (this.#verifyIfBetExists(betNumber - 1)) {
      return this.#betValues[betNumber - 1].betValue;
    }
  }

  cancelBet(betNumber) {
    if (this.#verifyIfBetExists(betNumber - 1)) {
      this.#betValues[betNumber - 1].betValue = 0;
      this.#betValues[betNumber - 1].hasBet = false;
      this.#betValues[betNumber - 1].status = "wait";
    }
  }

  loseBetsDone() {
    this.#betValues.forEach((bet) => {
      if (bet.status == "bet") {
        bet.status = "lose";
        bet.hasBet = false;
      }
    });
  }

  getLostBets() {
    return this.#betValues.filter((bet) => bet.status == "lose");
  }

  winBet(betNumber) {
    if (this.#verifyIfBetExists(betNumber - 1)) {
      this.#betValues[betNumber - 1].hasBet = false;
      this.#betValues[betNumber - 1].status = "win";
    }
  }

  #verifyIfBetExists(index) {
    return this.#betValues[index] ? true : false;
  }

  get money() {
    return this.#money;
  }

  setMoney(newMoney) {
    this.#money = newMoney;
  }

  winMoney(winnedMoney) {
    this.#money += winnedMoney;
    this.updateMoneyOnInterface();
    console.log(this.money);
  }
  loseMoney(lostMoney) {
    this.#money -= lostMoney;
    this.updateMoneyOnInterface();
    console.log(this.money);
  }

  updateMoneyOnInterface() {
    this.#playerMoneyTextEl.innerText = this.money.toFixed(2);
  }
}

export { Player };
