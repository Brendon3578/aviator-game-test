import {
  elementExists,
  formatDateToBrazilianFormat,
  log,
  roundToTwoDecimalPlaces,
  showAlert,
} from "../utils.js";

/**
 * Classe que representa o histórico de rodadas.
 * @class
 */
class RoundsHistory {
  /**
   * Objeto que representa uma rodada no histórico.
   * @typedef {Object} Round
   * @property {number} value - O valor da rodada.
   * @property {string} timestamp - O carimbo de data e hora da rodada.
   */

  /**
   * Histórico das últimas rodadas.
   * @type {Array<Round>}
   */
  #roundsHistory = [];

  /**
   * Número máximo de rodadas a serem salvas no histórico.
   * @type {number}
   */
  #maxRoundsToSave = 20;
  /**
   * Chave utilizada para armazenar o histórico no localStorage.
   * @type {string}
   * @private
   */
  #key = "last-rounds-history";

  /**
   * Elemento da lista onde o histórico será exibido.
   * @type {HTMLElement}
   */
  #listElement;

  /**
   * Cria um novo objeto RoundsHistory.
   * @param {HTMLElement} listElement - O elemento HTML da lista onde o histórico será exibido.
   */
  constructor(listElement) {
    this.#roundsHistory = JSON.parse(this.#getFromStorage()) || [];

    // -- Validar se o elemento existe
    if (elementExists(listElement) == false) {
      throw new Error(
        "Last Rounds History unordered list (<ul>) element don't exists!"
      );
    }
    this.#listElement = listElement;
  }

  /**
   * Getter para obter o tamanho do array de histórico de rodadas.
   * @returns {number} O tamanho do histórico de rodadas.
   */
  get size() {
    return this.#roundsHistory.length;
  }

  /**
   * Getter que verifica se o histórico de rodadas está vazio.
   * @returns {boolean} Verdadeiro se o histórico estiver vazio, falso caso contrário.
   */
  get isEmpty() {
    return this.size == 0;
  }

  /**
   * Getter que verifica se o histórico de rodadas atingiu sua capacidade máxima.
   * @returns {boolean} Verdadeiro se o histórico atingiu sua capacidade máxima, falso caso contrário.
   */
  get hasMaxCapacity() {
    return this.size > this.#maxRoundsToSave;
  }

  /**
   * Salva um valor no localStorage.
   * @param {string} value - O valor a ser salvo no localStorage.
   */
  #saveInStorage(value) {
    window.localStorage.setItem(this.#key, value);
  }

  /**
   * Obtém um valor do localStorage.
   * @returns {string | null} O valor obtido do localStorage, ou null se não estiver presente.
   */
  #getFromStorage() {
    return window.localStorage.getItem(this.#key);
  }

  /**
   * Adiciona um novo round no início do histórico.
   * @param {Round} round - O objeto representando o novo round a ser adicionado.
   */
  #addNewRoundInBegin(round) {
    this.#roundsHistory.unshift(round);
  }

  /**
   * Remove o round mais antigo do histórico.
   */
  #removeOutdatedRound() {
    this.#roundsHistory.pop();
  }

  /**
   * Salva uma nova rodada no histórico.
   * @param {number} value - O valor da rodada a ser salvo.
   */
  saveNewRoundInHistory(value) {
    this.#addNewRoundInBegin({
      value: roundToTwoDecimalPlaces(value),
      timestamp: formatDateToBrazilianFormat(new Date()),
    });

    // -- Deixar no máximo 20 elementos
    if (this.hasMaxCapacity) {
      this.#removeOutdatedRound();
    }

    log("storage", "Partida salva no localStorage!");
    this.#saveInStorage(JSON.stringify(this.#roundsHistory));
    this.updateRoundsHistoryInListElement();
  }

  /**
   * Exclui todos os rounds do histórico de rodadas no localStorage e redefine o histórico interno como vazio.
   */
  #deleteAllRoundsInHistoryStorage() {
    this.#roundsHistory = [];
    this.#saveInStorage(JSON.stringify([]));
  }

  /**
   * Cria uma cor de fundo do tipo HSL com base no valor do round para ser utilizado no CSS.
   * Exemplo: 'hsl(230, 40%, 50%)'.
   * @param {number} roundValue - O valor do round.
   * @returns {string} A cor de fundo calculada do tipo HSL.
   */
  #createBackgroundColor(roundValue) {
    // https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/hsl
    let hue = 200 + roundValue * 5;
    return `hsl(${hue}, 40%, 50%)`;
  }

  /**
   * Limpa todo o histórico de rodadas, atualiza a exibição na interface e exibe um alerta indicando que o histórico foi excluído.
   */
  clearRoundHistory() {
    this.#deleteAllRoundsInHistoryStorage();
    this.updateRoundsHistoryInListElement();
    showAlert("Histórico das últimas partidas excluídas.");
  }

  /**
   * Atualiza o histórico de rodadas na lista de elementos HTML.
   */
  updateRoundsHistoryInListElement() {
    this.#listElement.innerHTML = "";
    if (this.isEmpty) {
      this.#listElement.innerHTML = this.createEmptyItemElement();
      return;
    }
    this.#roundsHistory.forEach((lastRound) => {
      this.#listElement.innerHTML += this.createListItemElement(lastRound);
    });
    return;
  }

  /**
   * Cria um elemento de lista HTML para exibir os detalhes de uma rodada.
   * @param {Round} round - O objeto representando a rodada.
   * @returns {string} O elemento de lista HTML criado.
   */
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

  /**
   * Cria um elemento HTML para exibir quando o histórico estiver vazio.
   * @returns {string} O elemento HTML vazio criado.
   */
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
