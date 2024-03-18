/**
 * @param {Date} data
 */
function dataAtualFormatada(data) {
  let dia = data.getDate().toString();
  let diaF = dia.length == 1 ? "0" + dia : dia;
  let mes = (data.getMonth() + 1).toString(); //+1 pois no getMonth Janeiro começa com zero.
  let mesF = mes.length == 1 ? "0" + mes : mes;
  let anoF = data.getFullYear();
  let hora = data.getHours();
  let minuto = data.getMinutes();
  return `${diaF}/${mesF}/${anoF} - ${hora}:${minuto}`;
}

export { dataAtualFormatada };
