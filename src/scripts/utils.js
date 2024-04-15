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

/**
 * Retorna a data atual formatada conforme o fuso horário "pt-BR".
 * @param {Date} date - O objeto Date que representa a data.
 * @returns {string} Retorna a data atual formatada como uma string no formato local, com o fuso horário configurado para "pt-BR".
 */
function formatDateToBrazilianFormat(date) {
  return date.toLocaleString("pt-BR", { timezone: "UTC" });
}

/**
 * Verifica se o valor fornecido é do tipo booleano.
 * @param {*} b - O valor a ser verificado.
 * @returns {boolean} Retorna true se o valor fornecido for do tipo booleano, caso contrário, retorna false.
 */
const isBoolean = (b) => (typeof b == "boolean" ? true : false);

/**
 * Verifica se um elemento existe, ou seja, se não é nulo ou indefinido.
 * @param {*} el - O elemento a ser verificado.
 * @returns {boolean} Retorna true se o elemento existir (não for nulo ou indefinido), caso contrário, retorna false.
 */
const elementExists = (el) => el != null;

/**
 * Retorna um número aleatório entre 0 (inclusive) e o valor máximo fornecido (exclusive), com precisão de duas casas decimais.
 * @param {number} max - O valor máximo (exclusive) a partir do qual o número aleatório será gerado.
 * @returns {number} Retorna um número aleatório entre 0 (inclusive) e o valor máximo fornecido (exclusive), com precisão de duas casas decimais.
 */
function getRandomNumber(max) {
  const randomNumber = Math.random() * max;
  // Arredondar para duas casas decimais
  // https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
  return Math.round((randomNumber + Number.EPSILON) * 100) / 100;
}

/**
 * Arredonda um número de ponto flutuante para duas casas decimais.
 * @param {number} numero - O número a ser arredondado.
 * @returns {number} Um número com apenas duas casas decimais.
 */
function roundToTwoDecimalPlaces(number) {
  return Math.round(number * 100) / 100;
}

function showAlert(message, isError = false) {
  log("alert", message);
  window.alert(message);
}

const VALID_BET_STATUS = ["bet", "cancel", "cash-out"];
/**
 * Verifica se o status da aposta é válido, podendo ser apenas "bet", "cancel" ou "cash-out".
 * @param {string} betStatus - O status da aposta do fieldset que vem do atributo 'data-bet-status' definido no fieldset.
 * @returns {boolean} Retorna true se o status for válido, caso contrário, retorna false.
 */
function isBetStatusValid(betStatus) {
  return VALID_BET_STATUS.includes(betStatus);
}

/**
 * Função que aguarda a quantidade especificada de milissegundos antes de resolver a promessa.
 * Útil para usar com `async` e `await` fazendo com que o programa espere antes de seguir a própria instrução.
 * @param {number} ms - O número de milissegundos a aguardar.
 * @returns {Promise<void>} - Uma promessa que será resolvida após o tempo especificado.
 */
async function sleep(ms) {
  log("sleep", `Esperando ${parseFloat(ms / 1000).toFixed(2)} segundos`);

  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Função responsável por exibir uma mensagem informativa, de alerta ou executar uma operação de espera ou armazenamento.
 * @typedef {("info"|"alert"|"sleep"|"storage"|"start"|"round")} ActionType
 */

/**
 * Função utilitária apenas para mostrar a mensagem no console.
 * @param {ActionType} type - O tipo da mensagem.
 * @param {string} message - A mensagem a ser registrada.
 */
function log(type, message) {
  console.log(`[${type}] - ${message}`);
}

export {
  formatDateToBrazilianFormat,
  getRandomNumber,
  showAlert,
  isBoolean,
  elementExists,
  isBetStatusValid,
  roundToTwoDecimalPlaces,
  sleep,
  log,
};
