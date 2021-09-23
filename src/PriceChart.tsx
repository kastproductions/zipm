import React, { useRef, useState } from "react";
import { createChart } from "lightweight-charts";

export function PriceChart({ containerSize, point }) {
  useInitialChart({ containerSize, point });
  if (!containerSize) return null
  return (
    <div id="container" />
  );
}

function useInitialChart({ containerSize, point }) {
  const chartRef = useRef();
  const seriesRef = useRef();
  const [isLoaded, setIsloaded] = useState(false);
  // const size = useWindowSize();

  React.useEffect(() => {
    if (!containerSize) return
    var width = containerSize.width;
    var height = containerSize.height;
    // if (chartRef?.current) return
    // @ts-ignore
    chartRef.current = createChart(document.getElementById("container"), {
      width: width,
      height: height,
      rightPriceScale: {
        visible: false
      },
      leftPriceScale: {
        visible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.4
        },
        borderVisible: false,
        mode: 1
      },
      timeScale: {
        visible: false
      },
      layout: {
        backgroundColor: "transparent",
        textColor: "#333"
      },
      grid: {
        horzLines: {
          visible: false
        },
        vertLines: {
          visible: false
        }
      },
      crosshair: {
        horzLine: {
          visible: true
        },
        vertLine: {
          visible: false
        }
      }
    });
    // @ts-ignore
    seriesRef.current = chartRef.current.addAreaSeries({
      topColor: 'rgb(32,189,202, 0.4)',
      bottomColor: 'rgb(21,43,67, 0.0)',
      lineColor: 'rgb(21,43,67)',
      lineWidth: 2
    });
    // @ts-ignore
    chartRef.current.timeScale().setVisibleLogicalRange({
      from: -1000,
      to: 0
    });

    if (seriesRef?.current && chartRef?.current) {
      setIsloaded(true);
    }
  }, [containerSize]);

  // React.useEffect(() => {
  //   if (seriesRef?.current) {
  //     // @ts-ignore
  //     chartRef.current.resize(size.width / 2, size.height / 2);
  //   }
  // }, [size]);

  React.useEffect(() => {
    if (point && seriesRef?.current) {
      // @ts-ignore
      seriesRef.current.update(point);
    }
  }, [point]);

  return { chart: chartRef?.current, series: seriesRef?.current, isLoaded };
}

function useWS() {
  const [point, setPoint] = React.useState(null);
  // const prevPoint = usePrevious(point);

  React.useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws");
    const msg = {
      method: "SUBSCRIBE",
      params: ["btcusdt@trade"],
      id: 1
    };
    ws.onopen = () => {
      ws.send(JSON.stringify(msg));
    };
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log({ data });
      if (!data?.E || !data?.p) return;
      // console.log(prevPoint);
      // if (prevPoint && Math.abs(data.p - prevPoint) < 0.2) return;
      const newPoint = {
        time: data.E,
        value: +data.p
      };

      setPoint(newPoint);

      return () => {
        ws.close();
      };
    };
  }, []);

  return point;
}

// Hook
function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  React.useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

function useWindowSize() {
  // Initialize state with undefined width/height so server and client renders match
  // Learn more here: https://joshwcomeau.com/react/the-perils-of-rehydration/
  const [windowSize, setWindowSize] = React.useState({
    width: undefined,
    height: undefined
  });
  React.useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return windowSize;
}


var data = [
  { time: "2018-03-28", value: 21.0 },
  { time: "2018-03-29", value: 20.8 },
  { time: "2018-03-30", value: 19.4 },
  { time: "2018-04-02", value: 18.75 },
  { time: "2018-04-03", value: 18.75 },
  { time: "2018-04-04", value: 18.95 },
  { time: "2018-04-05", value: 16.95 },
  { time: "2018-04-06", value: 17.7 },
  { time: "2018-04-09", value: 31.0 },
  { time: "2018-04-10", value: 30.2 },
  { time: "2018-04-11", value: 31.5 },
  { time: "2018-04-12", value: 27.95 },
  { time: "2018-04-13", value: 30.15 },
  { time: "2018-04-16", value: 29.6 },
  { time: "2018-04-17", value: 27.7 },
  { time: "2018-04-18", value: 21.45 },
  { time: "2018-04-19", value: 24.05 },
  { time: "2018-04-20", value: 25.6 },
  { time: "2018-04-23", value: 26.5 },
  { time: "2018-04-24", value: 28.4 },
  { time: "2018-04-25", value: 30.55 },
  { time: "2018-04-26", value: 29.4 },
  { time: "2018-04-27", value: 30.7 },
  { time: "2018-04-30", value: 31.0 },
  { time: "2018-05-02", value: 27.7 },
  { time: "2018-05-03", value: 30.8 },
  { time: "2018-05-04", value: 33.35 },
  { time: "2018-05-07", value: 33.1 },
  { time: "2018-05-08", value: 34.6 },
  { time: "2018-05-10", value: 35.2 },
  { time: "2018-05-11", value: 37.5 },
  { time: "2018-05-14", value: 38.85 },
  { time: "2018-05-15", value: 37.0 },
  { time: "2018-05-16", value: 37.05 },
  { time: "2018-05-17", value: 37.05 },
  { time: "2018-05-18", value: 38.25 },
  { time: "2018-05-21", value: 38.8 },
  { time: "2018-05-22", value: 40.0 },
  { time: "2018-05-23", value: 42.45 },
  { time: "2018-05-24", value: 42.3 },
  { time: "2018-05-25", value: 42.8 },
  { time: "2018-05-28", value: 43.45 },
  { time: "2018-05-29", value: 43.15 },
  { time: "2018-05-30", value: 35.15 },
  { time: "2018-05-31", value: 34.2 },
  { time: "2018-06-01", value: 35.35 },
  { time: "2018-06-04", value: 37.9 },
  { time: "2018-06-05", value: 35.75 },
  { time: "2018-06-06", value: 33.7 },
  { time: "2018-06-07", value: 30.0 },
  { time: "2018-06-08", value: 31.1 },
  { time: "2018-06-11", value: 32.3 },
  { time: "2018-06-13", value: 30.95 },
  { time: "2018-06-14", value: 31.45 },
  { time: "2018-06-15", value: 34.5 },
  { time: "2018-06-18", value: 35.35 },
  { time: "2018-06-19", value: 37.0 },
  { time: "2018-06-20", value: 34.0 },
  { time: "2018-06-21", value: 34.45 },
  { time: "2018-06-22", value: 34.45 },
  { time: "2018-06-25", value: 34.25 },
  { time: "2018-06-26", value: 34.35 },
  { time: "2018-06-27", value: 33.85 },
  { time: "2018-06-28", value: 35.2 },
  { time: "2018-06-29", value: 35.2 },
  { time: "2018-07-02", value: 34.85 },
  { time: "2018-07-03", value: 31.95 },
  { time: "2018-07-04", value: 35.0 },
  { time: "2018-07-05", value: 45.8 },
  { time: "2018-07-06", value: 45.45 },
  { time: "2018-07-09", value: 46.7 },
  { time: "2018-07-10", value: 48.45 },
  { time: "2018-07-11", value: 50.7 },
  { time: "2018-07-12", value: 50.2 },
  { time: "2018-07-13", value: 51.75 },
  { time: "2018-07-16", value: 52.0 },
  { time: "2018-07-17", value: 50.75 },
  { time: "2018-07-18", value: 52.0 },
  { time: "2018-07-19", value: 54.0 },
  { time: "2018-07-20", value: 53.55 },
  { time: "2018-07-23", value: 51.2 },
  { time: "2018-07-24", value: 52.85 },
  { time: "2018-07-25", value: 53.7 },
  { time: "2018-07-26", value: 52.3 },
  { time: "2018-07-27", value: 52.8 },
  { time: "2018-07-30", value: 53.3 },
  { time: "2018-07-31", value: 52.05 },
  { time: "2018-08-01", value: 54.0 },
  { time: "2018-08-02", value: 59.0 },
  { time: "2018-08-03", value: 56.9 },
  { time: "2018-08-06", value: 60.7 },
  { time: "2018-08-07", value: 60.75 },
  { time: "2018-08-08", value: 63.15 },
  { time: "2018-08-09", value: 65.3 },
  { time: "2018-08-10", value: 70.0 },
  { time: "2018-08-13", value: 69.25 },
  { time: "2018-08-14", value: 67.75 },
  { time: "2018-08-15", value: 67.6 },
  { time: "2018-08-16", value: 64.5 },
  { time: "2018-08-17", value: 66.0 },
  { time: "2018-08-20", value: 66.05 },
  { time: "2018-08-21", value: 66.65 },
  { time: "2018-08-22", value: 66.4 },
  { time: "2018-08-23", value: 69.35 },
  { time: "2018-08-24", value: 70.55 },
  { time: "2018-08-27", value: 68.8 },
  { time: "2018-08-28", value: 68.45 },
  { time: "2018-08-29", value: 63.2 },
  { time: "2018-08-30", value: 59.5 },
  { time: "2018-08-31", value: 59.5 },
  { time: "2018-09-03", value: 60.45 },
  { time: "2018-09-04", value: 62.25 },
  { time: "2018-09-05", value: 63.5 },
  { time: "2018-09-06", value: 66.9 },
  { time: "2018-09-07", value: 66.45 },
  { time: "2018-09-10", value: 68.5 },
  { time: "2018-09-11", value: 69.9 },
  { time: "2018-09-12", value: 67.8 },
  { time: "2018-09-13", value: 67.9 },
  { time: "2018-09-14", value: 69.25 },
  { time: "2018-09-17", value: 68.95 },
  { time: "2018-09-18", value: 65.85 },
  { time: "2018-09-19", value: 63.6 },
  { time: "2018-09-20", value: 64.0 },
  { time: "2018-09-21", value: 64.0 },
  { time: "2018-09-24", value: 66.05 },
  { time: "2018-09-25", value: 68.35 },
  { time: "2018-09-26", value: 68.3 },
  { time: "2018-09-27", value: 67.95 },
  { time: "2018-09-28", value: 68.45 },
  { time: "2018-10-01", value: 68.8 },
  { time: "2018-10-02", value: 68.6 },
  { time: "2018-10-03", value: 67.9 },
  { time: "2018-10-04", value: 68.6 },
  { time: "2018-10-05", value: 70.35 },
  { time: "2018-10-08", value: 72.35 },
  { time: "2018-10-09", value: 72.9 },
  { time: "2018-10-10", value: 72.85 },
  { time: "2018-10-11", value: 74.1 },
  { time: "2018-10-12", value: 73.0 },
  { time: "2018-10-15", value: 74.85 },
  { time: "2018-10-16", value: 76.0 },
  { time: "2018-10-17", value: 77.0 },
  { time: "2018-10-18", value: 79.0 },
  { time: "2018-10-19", value: 79.5 },
  { time: "2018-10-22", value: 82.6 },
  { time: "2018-10-23", value: 82.7 },
  { time: "2018-10-24", value: 82.1 },
  { time: "2018-10-25", value: 83.15 },
  { time: "2018-10-26", value: 83.4 },
  { time: "2018-10-29", value: 80.95 },
  { time: "2018-10-30", value: 76.75 },
  { time: "2018-10-31", value: 77.75 },
  { time: "2018-11-01", value: 78.12 },
  { time: "2018-11-02", value: 73.22 },
  { time: "2018-11-06", value: 72.6 },
  { time: "2018-11-07", value: 74.4 },
  { time: "2018-11-08", value: 76.5 },
  { time: "2018-11-09", value: 79.86 },
  { time: "2018-11-12", value: 78.1 },
  { time: "2018-11-13", value: 77.6 },
  { time: "2018-11-14", value: 71.7 },
  { time: "2018-11-15", value: 72.26 },
  { time: "2018-11-16", value: 73.8 },
  { time: "2018-11-19", value: 76.28 },
  { time: "2018-11-20", value: 72.8 },
  { time: "2018-11-21", value: 66.2 },
  { time: "2018-11-22", value: 65.1 },
  { time: "2018-11-23", value: 61.26 },
  { time: "2018-11-26", value: 64.1 },
  { time: "2018-11-27", value: 61.72 },
  { time: "2018-11-28", value: 61.4 },
  { time: "2018-11-29", value: 61.86 },
  { time: "2018-11-30", value: 60.6 },
  { time: "2018-12-03", value: 63.16 },
  { time: "2018-12-04", value: 68.3 },
  { time: "2018-12-05", value: 67.2 },
  { time: "2018-12-06", value: 68.56 },
  { time: "2018-12-07", value: 71.3 },
  { time: "2018-12-10", value: 73.98 },
  { time: "2018-12-11", value: 72.28 },
  { time: "2018-12-12", value: 73.2 },
  { time: "2018-12-13", value: 73.0 },
  { time: "2018-12-14", value: 72.9 },
  { time: "2018-12-17", value: 73.96 },
  { time: "2018-12-18", value: 73.4 },
  { time: "2018-12-19", value: 73.0 },
  { time: "2018-12-20", value: 72.98 },
  { time: "2018-12-21", value: 72.8 },
  { time: "2018-12-24", value: 72.9 },
  { time: "2018-12-25", value: 74.2 },
  { time: "2018-12-26", value: 73.98 },
  { time: "2018-12-27", value: 74.5 },
  { time: "2018-12-28", value: 74.0 },
  { time: "2019-01-03", value: 73.5 },
  { time: "2019-01-04", value: 73.9 },
  { time: "2019-01-08", value: 73.9 },
  { time: "2019-01-09", value: 72.94 },
  { time: "2019-01-10", value: 69.86 },
  { time: "2019-01-11", value: 70.34 },
  { time: "2019-01-14", value: 68.78 },
  { time: "2019-01-15", value: 68.02 },
  { time: "2019-01-16", value: 66.6 },
  { time: "2019-01-17", value: 65.94 },
  { time: "2019-01-18", value: 68.0 },
  { time: "2019-01-21", value: 69.2 },
  { time: "2019-01-22", value: 69.76 },
  { time: "2019-01-23", value: 69.6 },
  { time: "2019-01-24", value: 69.62 },
  { time: "2019-01-25", value: 69.3 },
  { time: "2019-01-28", value: 69.2 },
  { time: "2019-01-29", value: 68.9 },
  { time: "2019-01-30", value: 66.4 },
  { time: "2019-01-31", value: 67.08 },
  { time: "2019-02-01", value: 69.78 },
  { time: "2019-02-04", value: 72.56 },
  { time: "2019-02-05", value: 72.74 },
  { time: "2019-02-06", value: 73.0 },
  { time: "2019-02-07", value: 73.38 },
  { time: "2019-02-08", value: 73.1 },
  { time: "2019-02-11", value: 73.22 },
  { time: "2019-02-12", value: 72.3 },
  { time: "2019-02-13", value: 74.86 },
  { time: "2019-02-14", value: 73.64 },
  { time: "2019-02-15", value: 73.38 },
  { time: "2019-02-18", value: 74.26 },
  { time: "2019-02-19", value: 75.0 },
  { time: "2019-02-20", value: 74.96 },
  { time: "2019-02-21", value: 75.0 },
  { time: "2019-02-22", value: 74.88 },
  { time: "2019-02-25", value: 74.96 },
  { time: "2019-02-26", value: 76.02 },
  { time: "2019-02-27", value: 77.3 },
  { time: "2019-02-28", value: 77.9 },
  { time: "2019-03-01", value: 78.24 },
  { time: "2019-03-04", value: 76.64 },
  { time: "2019-03-05", value: 78.74 },
  { time: "2019-03-06", value: 76.88 },
  { time: "2019-03-07", value: 75.32 },
  { time: "2019-03-11", value: 72.9 },
  { time: "2019-03-12", value: 74.78 },
  { time: "2019-03-13", value: 74.5 },
  { time: "2019-03-14", value: 75.34 },
  { time: "2019-03-15", value: 74.92 },
  { time: "2019-03-18", value: 75.08 },
  { time: "2019-03-19", value: 75.54 },
  { time: "2019-03-20", value: 76.78 },
  { time: "2019-03-21", value: 77.7 },
  { time: "2019-03-22", value: 77.34 },
  { time: "2019-03-25", value: 78.0 },
  { time: "2019-03-26", value: 77.98 },
  { time: "2019-03-27", value: 78.9 },
  { time: "2019-03-28", value: 78.3 },
  { time: "2019-03-29", value: 78.7 },
  { time: "2019-04-01", value: 77.22 },
  { time: "2019-04-02", value: 76.64 },
  { time: "2019-04-03", value: 76.5 },
  { time: "2019-04-04", value: 76.64 },
  { time: "2019-04-05", value: 75.46 },
  { time: "2019-04-08", value: 76.42 },
  { time: "2019-04-09", value: 77.76 },
  { time: "2019-04-10", value: 77.68 },
  { time: "2019-04-11", value: 76.6 },
  { time: "2019-04-12", value: 76.78 },
  { time: "2019-04-15", value: 76.28 },
  { time: "2019-04-16", value: 75.88 },
  { time: "2019-04-17", value: 76.38 },
  { time: "2019-04-18", value: 77.0 },
  { time: "2019-04-19", value: 77.4 },
  { time: "2019-04-22", value: 77.4 },
  { time: "2019-04-23", value: 78.2 },
  { time: "2019-04-24", value: 78.68 },
  { time: "2019-04-25", value: 78.66 },
  { time: "2019-04-26", value: 77.88 },
  { time: "2019-04-29", value: 78.02 },
  { time: "2019-04-30", value: 78.68 },
  { time: "2019-05-02", value: 78.14 },
  { time: "2019-05-03", value: 78.3 },
  { time: "2019-05-06", value: 80.06 },
  { time: "2019-05-07", value: 80.5 },
  { time: "2019-05-08", value: 80.76 },
  { time: "2019-05-10", value: 82.1 },
  { time: "2019-05-13", value: 83.72 },
  { time: "2019-05-14", value: 83.55 },
  { time: "2019-05-15", value: 84.92 },
  { time: "2019-05-16", value: 83.32 },
  { time: "2019-05-17", value: 83.04 },
  { time: "2019-05-20", value: 83.92 },
  { time: "2019-05-21", value: 84.24 },
  { time: "2019-05-22", value: 84.0 },
  { time: "2019-05-23", value: 84.26 },
  { time: "2019-05-24", value: 84.0 },
  { time: "2019-05-27", value: 83.8 },
  { time: "2019-05-28", value: 84.32 },
  { time: "2019-05-29", value: 83.88 },
  { time: "2019-05-30", value: 84.58 },
  { time: "2019-05-31", value: 81.2 },
  { time: "2019-06-03", value: 84.35 },
  { time: "2019-06-04", value: 85.66 },
  { time: "2019-06-05", value: 86.51 }
];




