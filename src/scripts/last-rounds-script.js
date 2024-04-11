import { getRandomInt, formatDateToBrazilianFormat } from "./utils.js";

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
    timestamp: formatDateToBrazilianFormat(new Date(new Date().setDate(i))),
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
