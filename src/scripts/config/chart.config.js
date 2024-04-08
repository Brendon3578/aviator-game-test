export function buildChartConfiguration(dps) {
  return {
    title: {
      text: "1.00x",
      dockInsidePlotArea: true,
      verticalAlign: "center",
      fontSize: 100,
    },
    subtitles: [
      {
        text: "",
        //Uncomment properties below to see how they behave
        fontSize: 24,
        dockInsidePlotArea: true,
      },
    ],
    theme: "dark2",
    backgroundColor: "#030712", //gray 950
    toolTip: {
      enabled: false,
    },
    axisX: {
      lineColor: "#4b5563", //gray 600
      labelFontColor: "#4b5563", //gray 600
      gridThickness: 0,
      tickLength: 0,
      labelFontSize: 20,
      labelFormatter: (e) => ".",
    },
    axisY: {
      lineColor: "#4b5563", //gray 600
      labelFontColor: "#ed1836", //gray 600
      gridThickness: 0,
      tickLength: 0,
      margin: 10,
      lineThickness: 1,
      labelFontSize: 20,
      labelFormatter: (e) => ".",
    },
    data: [
      {
        color: "#ed1836",
        markerSize: 0,
        fillOpacity: 0.3,
        lineThickness: 4,
        type: "area",
        // markerImageUrl: "./assets/aviator.svg",
        markerImageUrl: "./assets/aviator_icon.png",
        dataPoints: dps,
      },
    ],
  };
}
