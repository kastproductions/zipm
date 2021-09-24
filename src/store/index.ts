import { proxy, useSnapshot } from "valtio";
import { createChart } from "lightweight-charts";
import React from "react";
import { nanoid } from "nanoid";

let c;
let s;

const state = proxy({
  currentPrice: {},
  balance: 1000,
  profit: 0,
  loss: 0,
  bid: 1,
  total: 1,
  prevMarkers: [],
  history: [],
  setChartRefs: ({ seriesRef, chartRef }) => {
    s = seriesRef;
    c = chartRef;
  },
  setBid: (bid) => {
    state.bid = +bid;
    state.total = +state.bid.toFixed(2);
  },
  addMarker: (betType) => {
    const start = Date.now();
    const end = start + 10 * 1000;
    const color = betType === "up" ? "green" : "red";
    state.prevMarkers = [
      ...state.prevMarkers,
      {
        time: start,
        position: "inBar",
        color,
        shape: "circle",
        id: nanoid(),
        size: 1,
      },
      {
        time: end,
        position: "inBar",
        color,
        shape: "circle",
        id: nanoid(),
        size: 1,
      },
    ];

    s.setMarkers(state.prevMarkers);

    const priceLine = s.createPriceLine({
      price: state.currentPrice.value,
      color,
    });

    const newEntry = {
      id: nanoid(),
      timestamp: start,
      type: betType,
      size: state.bid,
      strikePrice: state.currentPrice.value,
      settlementPrice: "pending",
      status: "pending",
    };

    state.history = [newEntry, ...state.history];

    setTimeout(() => {
      s.removePriceLine(priceLine);
      const historyCopy = [...state.history];
      const objIndex = state.history.findIndex((obj) => obj.id === newEntry.id);
      const prevHistoryItem = historyCopy[objIndex];
      prevHistoryItem.settlementPrice = state.currentPrice.value;
      prevHistoryItem.status = (() => {
        if (newEntry.type === "up") {
          if (prevHistoryItem.settlementPrice > prevHistoryItem.strikePrice) {
            return "Win";
          } else {
            return "Loss";
          }
        }
        if (newEntry.type === "down") {
          if (prevHistoryItem.settlementPrice < prevHistoryItem.strikePrice) {
            return "Win";
          } else {
            return "Loss";
          }
        }
      })();
      state.history = historyCopy;
    }, 10 * 1000);
  },
  updateSeries: (point) => {
    if (!point?.time || !point?.value || !s) return;
    s.update(point);
    state.currentPrice = point;
    s.setMarkers([
      ...state.prevMarkers,
      {
        time: point.time,
        position: "inBar",
        color: "rgba(33, 150, 243, 1)",
        shape: "circle",
        id: nanoid(),
        size: 1,
      },
    ]);
  },
});

const defaultSettings = {
  marginRight: 20,
  rightPriceScale: {
    visible: false,
  },
  leftPriceScale: {
    visible: true,
    scaleMargins: {
      top: 0,
      bottom: 0.1,
    },
    borderVisible: false,
    // mode: 1,
  },
  timeScale: {
    visible: false,
  },
  layout: {
    backgroundColor: "transparent",
    textColor: "#333",
  },
  grid: {
    horzLines: {
      visible: false,
    },
    vertLines: {
      visible: false,
    },
  },
  crosshair: {
    horzLine: {
      visible: true,
    },
    vertLine: {
      visible: false,
    },
  },
};

export function useStore() {
  return useSnapshot(state);
}

function useWS() {
  const [point, setPoint] = React.useState({});

  React.useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws");
    const msg = {
      method: "SUBSCRIBE",
      params: ["btcusdt@trade"],
      id: 1,
    };
    ws.onopen = () => {
      ws.send(JSON.stringify(msg));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log({ data });
      if (!data?.E || !data?.p) return;
      const newPoint = {
        time: data.E,
        value: parseFloat(data.p),
      };
      setPoint(newPoint);

      return () => {
        ws.close();
      };
    };
  }, []);

  return point;
}

export function useChartInitializer({ containerSize }) {
  const [isLoaded, setIsloaded] = React.useState(false);
  const snap = useStore();
  const point = useWS();

  const chartRef = React.useRef();
  const seriesRef = React.useRef();

  React.useLayoutEffect(() => {
    // if (snap.chartRef) return;
    if (!containerSize?.width) return;
    const width = containerSize.width;
    const height = containerSize.height || 250;

    chartRef.current = createChart(document.getElementById("container"), {
      width,
      height,
      ...defaultSettings,
    });

    seriesRef.current = chartRef.current.addAreaSeries({
      topColor: "rgba(33, 150, 243, 0.56)",
      bottomColor: "rgba(33, 150, 243, 0.0)",
      lineColor: "rgba(33, 150, 243, 1)",
      lineWidth: 1,
    });

    chartRef.current.timeScale().setVisibleLogicalRange({
      from: -4000,
      to: 0,
    });

    snap.setChartRefs({ seriesRef: seriesRef.current, chartRef: chartRef.current });

    setIsloaded(true);
  }, [containerSize]);

  React.useEffect(() => {
    if (seriesRef.current) {
      snap.updateSeries(point);
      // snap.updateSeries({ point, seriesRef: seriesRef.current });
    }
  }, [point]);

  return { isLoaded };
}
