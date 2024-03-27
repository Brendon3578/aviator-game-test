const weekdayNames = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];
const monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez",
];

/**
 * @param {Date} date
 */
function dataAtualFormatada(date) {
  // let dateString = `${weekdayNames[date.getDay()]} ${date.getHours()}:${(
  //   "00" + date.getMinutes()
  // ).slice(-2)} ${date.getDate()} ${
  //   monthNames[date.getMonth()]
  // } ${date.getFullYear()}`;

  return date.toLocaleString("pt-BR", { timezone: "UTC" });
}

export { dataAtualFormatada };
