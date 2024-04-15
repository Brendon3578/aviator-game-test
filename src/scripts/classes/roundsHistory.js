import {
  elementExists,
  formatDateToBrazilianFormat,
  log,
  roundToTwoDecimalPlaces,
  showAlert,
} from "../utils.js";

class RoundsHistory {
  #lastRoundsHistory = [];
  #key = "last-rounds-history";
  #listElement;

  constructor(listElement) {
    this.#lastRoundsHistory = JSON.parse(this.#getFromStorage()) || [];

    // -- Validar se o elemento existe
    if (elementExists(listElement) == false) {
      throw new Error(
        "Last Rounds History unordered list (<ul>) element don't exists!"
      );
    }
    this.#listElement = listElement;
  }

  #saveInStorage(value) {
    window.localStorage.setItem(this.#key, value);
  }

  #getFromStorage() {
    return window.localStorage.getItem(this.#key);
  }

  saveNewRoundInHistory(value) {
    this.#lastRoundsHistory.unshift({
      value: roundToTwoDecimalPlaces(value),
      timestamp: formatDateToBrazilianFormat(new Date()),
    });

    if (this.#lastRoundsHistory.length > 20) {
      // -- Deixar no máximo 20 elementos
      this.#lastRoundsHistory.pop();
    }

    log("storage", "Partida salva no localStorage!");
    this.#saveInStorage(JSON.stringify(this.#lastRoundsHistory));
    this.updateRoundsHistoryInListElement();
  }

  #deleteAllRoundsInHistoryStorage() {
    this.#lastRoundsHistory = [];
    this.#saveInStorage(JSON.stringify([]));
  }

  #createBackgroundColor(roundValue) {
    let hue = 200 + roundValue * 2;
    // exemplo: background-color: hsl(230, 40%, 50%)
    return `hsl(${hue}, 40%, 50%)`;
  }

  clearRoundHistory() {
    this.#deleteAllRoundsInHistoryStorage();
    this.updateRoundsHistoryInListElement();
    showAlert("Histórico das últimas partidas excluídas.");
  }

  updateRoundsHistoryInListElement() {
    this.#listElement.innerHTML = "";
    if (this.#lastRoundsHistory.length == 0) {
      this.#listElement.innerHTML = this.createEmptyItemElement();
    } else {
      this.#lastRoundsHistory.forEach((lastRound) => {
        this.#listElement.innerHTML += this.createListItemElement(lastRound);
      });
    }
  }

  createListItemElement(round) {
    let backgroundColor = this.#createBackgroundColor(round.value);
    return `<li>
    <span
      style="background-color: ${backgroundColor}; border-color: ${backgroundColor};"
      class="py-0.5 px-2 rounded-full text-xs text-white border"
      title="Valor multiplicado: ${round.value}x - essa partida ocorreu em ${
      round.timestamp
    }"
    >
      ${round.value.toFixed(2)}x
    </span>
  </li>`;
  }

  createEmptyItemElement() {
    return `
    <li>
      <span class="text-sm text-gray-400 flex items-center gap-2">
        <!-- prettier-ignore -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="w-4 h-4">
          <path fill-rule="evenodd" d="M1 8a7 7 0 1 1 14 0A7 7 0 0 1 1 8Zm7.75-4.25a.75.75 0 0 0-1.5 0V8c0 .414.336.75.75.75h3.25a.75.75 0 0 0 0-1.5h-2.5v-3.5Z" clip-rule="evenodd" />
        </svg>
        Aqui ficará o histórico das partidas anteriores
      </span>
    </li>`;
  }
}

export { RoundsHistory };
