import { dataAtualFormatada, getRandomInt } from "./utils.js";

// ------------------------------------[ SCRIPT QUE GERA VALORES ALEATÓRIOS DAS ÚLTIMAS PARTIDAS - EM CIMA DO GRÁFICO DO AVIÃO ]------------------------------------

function getLastRoundBackgroundColor(number) {
  let hue = 200 + number;
  // example: background-color: hsl(230, 40%, 50%)
  return `hsl(${hue}, 40%, 50%)`;
}

const lastRoundsListEl = document.getElementById("last-rounds-list");
const LAST_ROUNDS_ARRAY = [];

for (let i = 0; i < 12; i++) {
  let randomValue = getRandomInt(15);
  if (getRandomInt(10) > 9.9) {
    randomValue = getRandomInt(300);
  }

  //console.log(randomValue);

  LAST_ROUNDS_ARRAY.push({
    value: `${randomValue}x`,
    timestamp: dataAtualFormatada(new Date(new Date().setDate(i))),
    background_color: getLastRoundBackgroundColor(randomValue * 8),
  });
}

LAST_ROUNDS_ARRAY.forEach((round) => {
  lastRoundsListEl.innerHTML += `<li>
    <span
      style="background-color: ${round.background_color}; border-color: ${round.background_color};"
      class="py-0.5 px-2 rounded-full text-xs text-white border"
      title="Essa partida ocorreu em ${round.timestamp}"
    >
      ${round.value}
    </span>
  </li>`;
});

// ------------------------------------[ SCRIPT DOS BOTÕES DE ADICIONAR MAIS DINHEIRO NO INPUT ]------------------------------------

// script do game action - buttons de apostar
const firstNumberBetInput = document.getElementById("bet-value-1");
const secondNumberBetInput = document.getElementById("bet-value-2");
const updateBetButtons = document.querySelectorAll(
  "button[data-button-update-bet]"
);
updateBetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let valueToAdd = button.dataset.buttonUpdateBet;
    let betInputToAdd = button.dataset.betValueInput;
    console.log(betInputToAdd);

    console.log(valueToAdd);

    if (betInputToAdd == "1") {
      updateBetValue(valueToAdd, firstNumberBetInput);
    } else if (betInputToAdd == "2") {
      updateBetValue(valueToAdd, secondNumberBetInput);
    } else {
      throw new Error(`dataset attribute not defined on button`);
    }
  });
});

function updateBetValue(valueToAdd, inputBetEl) {
  let newValue = parseFloat(inputBetEl.value) + parseInt(valueToAdd);
  if (isNaN(newValue)) {
    inputBetEl.value = "0";
  } else {
    if (newValue < 0.01) {
      inputBetEl.value = "1";
    } else {
      inputBetEl.value = newValue;
    }
  }
}

// ------------------------------------[ SCRIPT DOS BOTÕES DE APOSTA ]------------------------------------
const secondBetButton = document.getElementById("bet-button-2");
const firstBetFieldset = document.getElementById("bet-fieldset-1");
const secondBetFieldset = document.getElementById("bet-fieldset-2");

const betButtons = document.querySelectorAll("[data-bet-button]");

betButtons.forEach((button) => {
  const betButtonNumber = button.dataset.betButton;
  const betButtonValueText = button.querySelector("[data-bet-value]");
  const buttonText = button.querySelector("[data-bet-button-text]");
  const selectedFieldset = document.getElementById(
    `bet-fieldset-${betButtonNumber}`
  );
  let betStatus = "";

  // verificar se o atributo data-bet-button está definido dentro do button
  if (!betButtonNumber)
    throw new Error("button dataset attribute don't defined!");
  // verificar se os elementos dentro do button existem
  if (!betButtonValueText || !buttonText)
    throw new Error("button's elements not defined correctly!");
  // verificar se o fieldset existe no HTML
  if (!selectedFieldset) throw new Error("fieldset don't exists!");

  button.addEventListener("click", () => {
    // variável que pega o valor definido no atributo data-bet-button -> se é o primeiro ou segundo
    betStatus = selectedFieldset.dataset.betStatus;
    if (!betStatus) throw new Error("fieldset status don't defined!");
    if (!isBetStatusValid(betStatus))
      throw new Error("Not a valid fieldset status!");

    switch (betStatus) {
      case "bet":
        changeBetFieldsetStatus(selectedFieldset, "cancel");
        selectedFieldset.setAttribute("disabled", "");
        // setBetButtonDisabled(button, true);
        buttonText.textContent = "Cancel";
        break;
      case "cancel":
        changeBetFieldsetStatus(selectedFieldset, "bet");
        selectedFieldset.removeAttribute("disabled");
        buttonText.textContent = "Bet";
        break;
      case "cash-out":
        break;

      default:
        break;
    }
  });
});

const VALID_BET_STATUS = ["bet", "cancel", "cash-out"];
function isBetStatusValid(betStatus) {
  return VALID_BET_STATUS.includes(betStatus);
}

function changeBetFieldsetStatus(fieldsetElement, newStatus) {
  if (!isBetStatusValid(newStatus))
    throw new Error("Not a valid bet status to change fieldset!");
  fieldsetElement.dataset.betStatus = newStatus;
}

function setBetButtonDisabled(betButtonElement, boolean) {
  betButtonElement.dataset.buttonDisabled = boolean;
}
