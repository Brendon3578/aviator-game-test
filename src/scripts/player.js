class Player {
  #money;
  #playerMoneyTextEl = document.getElementById("player-money");

  constructor(money) {
    this.#money = money;
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
