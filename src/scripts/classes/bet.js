class Bet {
  #id;
  #hasBet;
  #value;
  #status; /* wait ou lose ou win ou bet */

  constructor(id) {
    this.#id = id;
    this.#hasBet = false;
    this.#value = 0;
    this.#status = "wait";
  }

  get id() {
    return this.#id;
  }

  get hasBet() {
    return this.#hasBet;
  }

  get value() {
    return this.#value;
  }

  get status() {
    return this.#status;
  }

  toBet(betValue) {
    this.#value = betValue;
    this.#hasBet = true;
    this.#status = "bet";
  }

  cancelBet() {
    this.#status = "wait";
    this.#value = 0;
    this.#hasBet = false;
  }

  loseBet() {
    this.#status = "lose";
    this.#hasBet = false;
  }

  winBet() {
    this.#status = "win";
    this.#hasBet = false;
  }
}

export { Bet };
