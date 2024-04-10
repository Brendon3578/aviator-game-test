import { Chart } from "./chart.js";
import { Game } from "./game.js";
import { Player } from "./player.js";
import { Round } from "./round.js";
import { dataAtualFormatada, getRandomInt, showAlert } from "./utils.js";

// ------------------------------------[ SCRIPT DOS PLAYER ]------------------------------------
const player = new Player();
const chart = new Chart();
const round = new Round(chart);

const game = new Game(player, round, chart);
game.init();

setTimeout(() => {
  const { roundDuration } = round.startNewRound();
  player.playersBets.forEach((betObject) => {
    const selectedFieldsetEl = document.getElementById(
      `bet-fieldset-${betObject.index}`
    );

    const numberbuttonTextElEl = selectedFieldsetEl.querySelector(
      "[data-bet-text-value]"
    );

    const updateFieldsetValueIntervalId = setInterval(() => {
      numberbuttonTextElEl.textContent = `${round.multiplierCount.toFixed(2)}x`;
    }, round.intervalTime);

    setTimeout(() => {
      clearInterval(updateFieldsetValueIntervalId);
    }, roundDuration);

    // TODO: fazer o jogador ganhar quando faz o cash out antes do avião voar e somar o o valor ganho do jogador
    // TODO: fazer o jogador perder quando o avião voar e subtrair o valor ganho do jogador

    console.log(betObject);

    changeBetFieldsetStatus(selectedFieldsetEl, "cash-out");
  });
}, 5000);

// ------------------------------------[ SCRIPT QUE GERA VALORES ALEATÓRIOS DAS ÚLTIMAS PARTIDAS - EM CIMA DO GRÁFICO DO AVIÃO ]------------------------------------

function getLastRoundBackgroundColor(number) {
  let hue = 200 + number;
  // example: background-color: hsl(230, 40%, 50%)
  return `hsl(${hue}, 40%, 50%)`;
}

const lastRoundsListEl = document.getElementById("last-rounds-list");
const LAST_ROUNDS_ARRAY = [];

for (let i = 0; i < 12; i++) {
  let randomValue = (getRandomInt(15) + 1).toFixed(2);
  if (getRandomInt(10) > 9.9) {
    randomValue = (getRandomInt(300) + 1).toFixed(2);
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
const updateBetButtons = document.querySelectorAll(
  "button[data-button-update-bet]"
);
updateBetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let valueToAdd = button.dataset.buttonUpdateBet;
    let betInputToAdd = button.dataset.betValueInput;
    let numberInputEl = document.getElementById(`bet-value-${betInputToAdd}`);

    updateBetValue(valueToAdd, numberInputEl);
  });
});

function updateBetValue(valueToAdd, inputBetEl) {
  let newValue = parseFloat(inputBetEl.value) + parseInt(valueToAdd);
  if (isNaN(newValue) || newValue < 0.01) {
    inputBetEl.value = "1";
  } else {
    inputBetEl.value = newValue;
  }
}

// ------------------------------------[ SCRIPT DOS BOTÕES DE APOSTA ]------------------------------------
const betButtons = document.querySelectorAll("[data-bet-button]");
function getBetValue(selectedFieldsetEl) {
  let input = selectedFieldsetEl.querySelector("[data-bet-value]");
  let betValue = parseFloat(input.value).toFixed(2);
  input.value = betValue;
  return parseFloat(betValue);
}

betButtons.forEach((button) => {
  const betButtonNumber = button.dataset.betButton;
  const betValueButtonTextEl = button.querySelector("[data-bet-text-value]");
  const buttonTextEl = button.querySelector("[data-bet-button-text]");
  const selectedFieldsetEl = document.getElementById(
    `bet-fieldset-${betButtonNumber}`
  );
  let betStatus = "";
  let bet = 0;

  // verificar se o atributo data-bet-button está definido dentro do button
  if (!betButtonNumber)
    throw new Error("button dataset attribute don't defined!");
  // verificar se os elementos dentro do button existem
  if (!betValueButtonTextEl || !buttonTextEl)
    throw new Error("button's elements not defined correctly!");
  // verificar se o fieldset existe no HTML
  if (!selectedFieldsetEl) throw new Error("fieldset don't exists!");

  button.addEventListener("click", () => {
    // variável que pega o valor definido no atributo data-bet-button -> se é o primeiro ou segundo
    betStatus = selectedFieldsetEl.dataset.betStatus;
    bet = getBetValue(selectedFieldsetEl);
    // let betValue = selectedFieldsetEl.

    if (!betStatus) throw new Error("fieldset status don't defined!");
    if (!isBetStatusValid(betStatus))
      throw new Error("Not a valid fieldset status!");
    switch (betStatus) {
      case "bet":
        if (bet > player.getMoney()) {
          // verificar se o player possui fatecoins suficientes
          showAlert("Você não possui esse dinheiro!");
        } else {
          changeBetFieldsetStatus(selectedFieldsetEl, "cancel");
          selectedFieldsetEl.setAttribute("disabled", "");
          buttonTextEl.textContent = "Cancel";

          player.setBetValue(betButtonNumber, bet);
          player.setMoney(player.getMoney() - bet);
          player.updateMoneyOnInterface();
        }

        break;
      case "cancel":
        player.cancelBet(betButtonNumber);
        changeBetFieldsetStatus(selectedFieldsetEl, "bet");
        selectedFieldsetEl.removeAttribute("disabled");
        buttonTextEl.textContent = "Bet";

        player.setMoney(player.getMoney() + bet);
        player.updateMoneyOnInterface();
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
