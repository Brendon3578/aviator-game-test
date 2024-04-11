import { Chart } from "./classes/chart.js";
import { Game } from "./classes/game.js";
import { Player } from "./classes/player.js";
import { Round } from "./classes/round.js";
import {
  elementExists,
  isBetStatusValid,
  isBoolean,
  showAlert,
} from "./utils.js";

// ------------------------------------[ SCRIPT DA PARTIDA ]------------------------------------
const player = new Player();
const chart = new Chart();
const round = new Round(chart);

const game = new Game(player, round, chart);
game.init();

// ------------------ [ COMEÇO DA PARTIDA ] ------------------
setTimeout(() => {
  const { roundDuration } = round.startNewRound();

  // ----- Desabilitar os fieldset e botões que não houveram aposta
  let fieldsetNotBettedEls = document.querySelectorAll(
    "fieldset[data-bet-status='bet']"
  );
  fieldsetNotBettedEls.forEach((fieldset) => {
    disableFieldsetAndBetButton(fieldset);
  });

  // ----- Pegar todos os fieldset
  let allFieldsetEls = document.querySelectorAll("fieldset[data-bet-status]");

  // ----- Para cada aposta feita...
  player.playersBets.forEach((betObject) => {
    // Desabilitar todos os
    allFieldsetEls.forEach((fieldset) => {
      setFieldsetDisabled(fieldset, true);
    });
    const bettedFieldsetEl = document.getElementById(
      `bet-fieldset-${betObject.index}`
    );

    const numberButtonTextEl = bettedFieldsetEl.querySelector(
      "[data-bet-text-value]"
    );

    changeBetFieldsetStatus(bettedFieldsetEl, "cash-out");

    const updateFieldsetValueIntervalId = setInterval(() => {
      numberButtonTextEl.textContent = `${round.multiplierCount.toFixed(2)}x`;
    }, round.intervalTime);

    setTimeout(() => {
      // quando acabar a partida, excluir o interval para que não fique repetindo
      clearInterval(updateFieldsetValueIntervalId);
    }, roundDuration);
  });

  // ------------- FIM DA PARTIDA ------------------
  setTimeout(() => {
    // desabilitar TUDO
    allFieldsetEls.forEach((fieldset) => {
      disableFieldsetAndBetButton(fieldset);

      const buttonTextEl = fieldset.querySelector("[data-bet-button-text]");
      changeBetFieldsetStatus(fieldset, "bet");
      buttonTextEl.textContent = "Bet";
    });
    player.loseBetsDone();

    let lostBets = player.getLostBets();

    // resolver erro de lógica que diminui 4 vezes
    lostBets.forEach((lostBet) => {
      console.log("ELE TEM QUE PERDER!");
      let lostMoney = player.getBetValue(lostBet.index) * round.multiplierCount;
      player.loseMoney(lostMoney);

      console.log(`Você perdeu ${lostMoney.toFixed(2)}!`);
      showAlert(`Você perdeu ${lostMoney.toFixed(2)}!`);
    });
  }, roundDuration);

  // TODO: fazer o jogador ganhar quando faz o cash out antes do avião voar e somar o o valor ganho do jogador

  // TODO: fazer o jogador perder quando o avião voar e subtrair o valor ganho do jogador
}, 5000);

// ------------------------------------[ SCRIPT DOS BOTÕES DE ADICIONAR MAIS DINHEIRO NO INPUT ]------------------------------------
function updateBetValue(valueToAdd, inputBetEl) {
  let newValue = parseFloat(inputBetEl.value) + parseInt(valueToAdd);
  if (isNaN(newValue) || newValue < 0.01) {
    inputBetEl.value = "1";
  } else {
    inputBetEl.value = newValue;
  }
}

// Script dos botões que aumentam o valor no input de número da aposta
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

// ------------------------------------[ SCRIPT DOS BOTÕES DE APOSTA ]------------------------------------
function getBetValueFromInput(fieldsetEl) {
  let input = fieldsetEl.querySelector("[data-bet-value]");
  let betValue = parseFloat(input.value).toFixed(2);
  input.value = betValue;
  return parseFloat(betValue);
}

const betButtonsEls = document.querySelectorAll("[data-bet-button]");

betButtonsEls.forEach((button) => {
  let betStatus = "";
  let bet = 0;
  const betNumber = button.dataset.betButton;
  const betValueButtonTextEl = button.querySelector("[data-bet-text-value]");
  const buttonTextEl = button.querySelector("[data-bet-button-text]");
  const selectedFieldsetEl = document.getElementById(
    `bet-fieldset-${betNumber}`
  );

  // verificar se o atributo data-bet-button está definido dentro do button
  if (!betNumber) throw new Error("button dataset attribute don't defined!");
  // verificar se os elementos dentro do button existem
  if (!betValueButtonTextEl || !buttonTextEl)
    throw new Error("button's elements not defined correctly!");
  // verificar se o fieldset existe no HTML
  if (!selectedFieldsetEl) throw new Error("fieldset don't exists!");

  button.addEventListener("click", () => {
    // variável que pega o valor definido no atributo data-bet-button -> se é o primeiro ou segundo
    betStatus = selectedFieldsetEl.dataset.betStatus;
    bet = getBetValueFromInput(selectedFieldsetEl);
    // let betValue = selectedFieldsetEl.

    if (!betStatus) throw new Error("fieldset status don't defined!");
    if (!isBetStatusValid(betStatus))
      throw new Error("Not a valid fieldset status!");
    switch (betStatus) {
      case "bet":
        if (bet > player.money) {
          // verificar se o player possui fatecoins suficientes
          showAlert("Você não possui esse dinheiro!");
        } else {
          player.setBetValue(betNumber, bet);
          player.loseMoney(bet);

          // mudança no HTML
          changeBetFieldsetStatus(selectedFieldsetEl, "cancel");
          setFieldsetDisabled(selectedFieldsetEl, true);
          buttonTextEl.textContent = "Cancel";
        }

        break;
      case "cancel":
        player.cancelBet(betNumber);
        player.winMoney(bet);

        // mudança no HTML
        changeBetFieldsetStatus(selectedFieldsetEl, "bet");
        setFieldsetDisabled(selectedFieldsetEl, false);
        buttonTextEl.textContent = "Bet";

        break;
      case "cash-out":
        if (round.isGameEnded == false) {
          player.winBet(betNumber);

          let winMoney = player.getBetValue(betNumber) * round.multiplierCount;
          player.winMoney(winMoney);
          showAlert(`Você ganhou ${winMoney.toFixed(2)}!`);
          console.log(`Você ganhou ${winMoney.toFixed(2)}!`);

          // mudança no HTML
          changeBetFieldsetStatus(selectedFieldsetEl, "bet");
          setFieldsetDisabled(selectedFieldsetEl, true);
          setBetButtonDisabled(button, true);
          buttonTextEl.textContent = "Bet";
        }
        break;

      default:
        break;
    }
  });
});

function changeBetFieldsetStatus(fieldsetElement, newStatus) {
  if (!isBetStatusValid(newStatus))
    throw new Error("Not a valid bet status to change fieldset!");
  fieldsetElement.dataset.betStatus = newStatus;
}

/**
 * - Essa função desabilita todos os botões de adicionar valores no input de número de aposta
 * - O único botão que não é desabilitado é o **principal**, o botão de Bet (Apostar)
 *
 * @param {HTMLFieldSetElement} fieldset Elemento fieldset que será desabilitado ou habilitado
 * @param {boolean} boolean Valor lógico que define se o fieldset será desabilitado ou habilitado
 */
function setFieldsetDisabled(fieldset, boolean) {
  if (elementExists(fieldset) == false)
    throw new Error(`Fieldset don't exists! - ${fieldset}`);
  if (isBoolean(boolean) == false)
    throw new Error("Not a valid boolean value to disable or enable fieldset!");

  if (boolean) {
    fieldset.setAttribute("disabled", "");
  } else {
    fieldset.removeAttribute("disabled");
  }
}

function disableFieldsetAndBetButton(fieldsetElement) {
  if (elementExists(fieldsetElement) == false)
    throw new Error(`Fieldset element don't exists! - ${fieldsetElement}`);

  let buttonToDisable = fieldsetElement.querySelector("[data-bet-button]");

  if (elementExists(buttonToDisable) == false)
    throw new Error(`Bet button element don't exists! - ${buttonToDisable}`);

  setFieldsetDisabled(fieldsetElement, true);

  setBetButtonDisabled(buttonToDisable, true);
}

function setBetButtonDisabled(betButtonElement, boolean) {
  if (elementExists(betButtonElement) == false)
    throw new Error(`Bet button element don't exists! - ${betButtonElement}`);
  if (isBoolean(boolean) == false)
    throw new Error("Not a valid boolean value to disable or enable button!");
  betButtonElement.dataset.buttonDisabled = boolean;
}
