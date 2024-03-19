import { dataAtualFormatada } from "./utils.js";

function getRandomInt(max) {
  const randomNumber = Math.random() * max;
  return Math.round((randomNumber + Number.EPSILON) * 100) / 100;
}

function getLastRoundBackgroundColor(number) {
  let hue = 200 + number;
  // example: background-color: hsl(230, 40%, 50%)
  return `hsl(${hue}, 40%, 50%)`;
}

const lastRoundsListEl = document.getElementById("last-rounds-list");
const LAST_ROUNDS_ARRAY = [];

for (let i = 0; i < 12; i++) {
  let randomValue = getRandomInt(15);

  console.log(randomValue);

  LAST_ROUNDS_ARRAY.push({
    value: `${randomValue}x`,
    timestamp: dataAtualFormatada(new Date(new Date().setDate(i))),
    background_color: getLastRoundBackgroundColor(randomValue * 8),
  });
}

LAST_ROUNDS_ARRAY.forEach((round) => {
  lastRoundsListEl.innerHTML += `<li>
    <span
      style="background-color: ${round.background_color};"
      class="py-0.5 px-2 rounded-full text-xs text-white"
      title="partida ocorreu em ${round.timestamp}"
    >
      ${round.value}
    </span>
  </li>`;
});

// script do game action - buttons de apostar
const numberInputBetEl = document.getElementById("bet-value");
const updateBetButtons = document.querySelectorAll(
  "button[data-button-update-bet]"
);
updateBetButtons.forEach((button) => {
  button.addEventListener("click", () => {
    let valueToAdd = button.dataset.buttonUpdateBet;
    console.log(valueToAdd);
    updateBetValue(valueToAdd);
  });
});

function updateBetValue(valueToAd) {
  let newValue = parseFloat(numberInputBetEl.value) + parseInt(valueToAd);
  if (isNaN(newValue)) {
    numberInputBetEl.value = "0";
  } else {
    if (newValue < 0.01) {
      numberInputBetEl.value = "1";
    } else {
      numberInputBetEl.value = newValue;
    }
  }
}
