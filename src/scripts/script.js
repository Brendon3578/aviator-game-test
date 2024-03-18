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
