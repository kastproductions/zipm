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
  winAmount: 0,
  lossAmount: 0,
  winLossRatio: 0,
  isBetDisabled: false,
  prevMarkers: [],
  history: [],
  setChartRefs: ({ seriesRef, chartRef }) => {
    s = seriesRef;
    c = chartRef;
  },
  setBid: (bid) => {
    if (!+bid || +bid > state.balance) {
      state.isBetDisabled = true;
      state.total = 0;
    } else {
      state.bid = +bid;
      state.total = state.bid + 0;
      state.isBetDisabled = false;
    }
  },
  addMarker: (betType) => {
    const start = state.currentPrice.time;
    // const end = start + 5 * 1000;
    const color = betType === "call" ? "green" : "red";
    const shape = betType === "call" ? "arrowUp" : "arrowDown";

    state.prevMarkers = [
      ...state.prevMarkers,
      {
        time: start,
        position: "inBar",
        color,
        id: nanoid(),
        size: 1,
        shape,
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
      secondsLeft: 5,
    };

    state.history = [newEntry, ...state.history];

    // let intervalId = setTimeout(function run() {
    //   // const historyCopy = [...state.history];
    //   const objIndex = state.history.findIndex((obj) => obj.id === newEntry.id);
    //   state.history[objIndex].secondsLeft -= 1;
    //   if (state.history[objIndex].secondsLeft === 0) {
    //     return clearTimeout(intervalId);
    //   } else {
    //     intervalId = setTimeout(run, 1000);
    //   }
    // }, 1000);

    const interval = 1000; // ms
    let expected = Date.now() + interval;
    let timeoutId = setTimeout(function step() {
      const dt = Date.now() - expected; // the drift (positive for overshooting)
      if (dt > interval) {
        // something really bad happened. Maybe the browser (tab) was inactive?
        // possibly special handling to avoid futile "catch up" run
      }
      const objIndex = state.history.findIndex((obj) => obj.id === newEntry.id);
      state.history[objIndex].secondsLeft -= 1;
      if (state.history[objIndex].secondsLeft === 0) {
        return clearTimeout(timeoutId);
      } else {
        expected += interval;
        timeoutId = setTimeout(step, Math.max(0, interval - dt)); // take into account drift
      }
    }, interval);

    const currentBid = state.bid;

    setTimeout(() => {
      clearInterval(timeoutId);
      s.removePriceLine(priceLine);
      const historyCopy = [...state.history];
      const objIndex = state.history.findIndex((obj) => obj.id === newEntry.id);
      const prevHistoryItem = historyCopy[objIndex];

      prevHistoryItem.settlementPrice = state.currentPrice.value;
      prevHistoryItem.status = (() => {
        if (newEntry.type === "call") {
          return prevHistoryItem.settlementPrice > prevHistoryItem.strikePrice ? "Won" : "Loss";
        }
        if (newEntry.type === "put") {
          return prevHistoryItem.settlementPrice < prevHistoryItem.strikePrice ? "Won" : "Loss";
        }
      })();

      if (prevHistoryItem.status === "Won") {
        const profit = calcProfit({
          startPrice: prevHistoryItem.settlementPrice,
          endPrice: prevHistoryItem.strikePrice,
          bid: currentBid,
        });
        state.balance += profit;
        state.winAmount += profit;
        state.winLossRatio = state.winAmount / (state.winAmount + state.lossAmount);
        prevHistoryItem.result = profit;
      } else {
        state.balance -= currentBid;
        state.lossAmount += currentBid;
        state.winLossRatio = state.winAmount / (state.winAmount + state.lossAmount);
        prevHistoryItem.result = currentBid;
      }
      if (state.bid > state.balance) {
        state.isBetDisabled = true;
      }
      state.history = historyCopy;
    }, 5 * 1000);
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
  // addSomeTime() {
  // const data = getFuturePointsInMiliseconds({ ms: 5 * 1000 });
  // s.setData(data);
  // },
});

function calcProfit({ startPrice, endPrice, bid }) {
  const premium = 1;
  const result = Math.min(5 * premium, Math.abs(endPrice - startPrice)) * bid;
  return result;
}

// function getFuturePointsInMiliseconds({ ms }: { ms: number }) {
//   let now = Date.now() + 2000;
//   const length = Math.floor(ms / 100);
//   return Array(length)
//     .fill(null)
//     .map((_) => {
//       now += 100;
//       return { time: now, value: 0 };
//     });
// }

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
    rightOffset: 12,
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
    // const ws = new WebSocket("wss://ws.bitstamp.net");
    const msg = {
      method: "SUBSCRIBE",
      params: ["btcusdt@trade"],
      id: 1,
    };
    // const msg = {
    //   event: "bts:subscribe",
    //   data: { channel: "btcusd" },
    // };
    ws.onopen = () => {
      ws.send(JSON.stringify(msg));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log({ data });
      // if (!data?.E || !data?.p) return;

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
      lastPriceAnimation: 1,
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
