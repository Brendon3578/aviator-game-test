const playerMoneyTextEl = document.getElementById("player-money");

function getPlayerMoney() {
  return playerMoneyTextEl.innerText;
}

function setPlayerMoney(newMoney) {
  playerMoneyTextEl.innerHTML = newMoney.toFixed(2);
}

const playerMoney = 100;

setPlayerMoney(playerMoney);
