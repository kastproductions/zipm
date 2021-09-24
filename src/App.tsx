import React from "react";
import {
  Spacer,
  Flex,
  Button,
  Box,
  Stack,
  Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Badge,
} from "@chakra-ui/react";
import { PriceChart } from "./PriceChart";
import { history } from "./mock-data";
import { useStore } from "./store";
import { format, formatDistance, formatRelative, subDays } from "date-fns";

declare global {
  interface Window {
    Highcharts: any;
  }
}

export default function App() {
  const snap = useStore();
  const prevPrice = usePrevious(snap.currentPrice);

  const chartContainerRef = React.useRef();
  const [containerSize, setSize] = React.useState(null);
  React.useEffect(() => {
    const size = {
      width: chartContainerRef.current.offsetWidth,
      height: chartContainerRef.current.offsetHeight,
    };
    console.log(size);
    setSize(size);
  }, []);
  // bg='linear-gradient(0deg, rgba(19, 68, 193, 0.4) 0%, rgba(0, 120, 255, 0.0)100%)'
  // bg='linear-gradient(0deg, rgba(19, 68, 193, 0.4) 0%, rgba(0, 120, 255, 0.0)100%)'
  // bgImage='linear-gradient(to bottom,rgb(32,189,202,0.5), rgb(21,43,67,0.5))'

  // rgb(32,189,202)
  // linear-gradient(to right, rgb(32,189,202, 1), rgb(21,43,67))
  return (
    <Stack
      height={["full", "100vh"]}
      minH={["100vh"]}
      bg="gray.100"
      fontFamily="Roboto"
      // bgImage="linear-gradient(to bottom, rgb(32,189,202, 0), rgb(32,189,202, 0.))"
    >
      <Stack height="full" maxW="8xl" mx="auto" width="full" p={4}>
        <Stack flex={1} direction={["column", "row"]} spacing={[4, 10]}>
          <Stack flex={1} width="full" height="full">
            <Stack isInline fontSize={["xl", "3xl"]} pb={[1, 4]} alignItems="center" justifyContent="space-between">
              <Box>
                <Text m={0} fontWeight="black">
                  BTC-USDT
                </Text>
              </Box>
              <Box>
                <Text
                  textAlign={["right", "center"]}
                  m={0}
                  fontWeight="medium"
                  color={prevPrice?.value > snap.currentPrice?.value ? "red.600" : "green.600"}
                >
                  {snap.currentPrice?.value?.toFixed(3) || ""}
                </Text>
              </Box>
            </Stack>
            <Box flex={1} ref={chartContainerRef} pr={[0]} bg="transparent">
              <PriceChart containerSize={containerSize} />
            </Box>
          </Stack>
          <Stack minW={["full", "sm"]}>
            <Stack>
              <Stack spacing={0} pb={4}>
                <Box>
                  <Text fontSize="3xl" fontWeight="medium">
                    Balance: ${snap.balance}
                  </Text>
                </Box>
                <Box>
                  <Text fontSize="sm" fontWeight="medium">
                    Profit / Loss: {snap.profit / snap.loss || 0}
                  </Text>
                </Box>
              </Stack>
              <Stack rounded="sm" p={[4, 6]} boxShadow="base" bg="white" spacing={5}>
                <Text fontSize="sm" fontWeight="medium">
                  BTC 1 min binary options
                </Text>
                <FormControl id="bid" display="flex" alignItems="center">
                  <FormLabel mb={0} width={48} fontSize="base" fontWeight="semibold">
                    Order Size
                  </FormLabel>
                  <NumberInput min={1} defaultValue={snap.bid} onChange={snap.setBid} borderColor="gray.700" width={32}>
                    <NumberInputField rounded="sm" _hover={{}} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                <Stack fontSize="md" fontWeight="semibold" isInline justifyContent="space-between" alignItems="center">
                  <Box>
                    <Text m={0}>Fee</Text>
                  </Box>
                  <Box>
                    <Text m={0}>$0.00</Text>
                  </Box>
                </Stack>
                <Stack fontSize="md" fontWeight="semibold" isInline justifyContent="space-between" alignItems="center">
                  <Box>
                    <Text m={0}>Total</Text>
                  </Box>
                  <Box>
                    <Text m={0}>${snap.total}</Text>
                  </Box>
                </Stack>
              </Stack>

              <Stack isInline spacing={8} pt={[1, 4]}>
                <Button
                  onClick={() => snap.addMarker("up")}
                  size="lg"
                  width="full"
                  rounded="sm"
                  fontSize="lg"
                  bg="green.300"
                  color="green.900"
                  boxShadow="md"
                  _hover={{
                    bg: "green.200",
                    boxShadow: "base",
                  }}
                >
                  Up &#8599;
                </Button>
                <Button
                  onClick={() => snap.addMarker("down")}
                  size="lg"
                  width="full"
                  rounded="sm"
                  fontSize="lg"
                  bg="red.300"
                  color="red.900"
                  boxShadow="md"
                  _hover={{
                    bg: "red.200",
                    boxShadow: "base",
                  }}
                >
                  Down &#8600;
                </Button>
              </Stack>
            </Stack>
            {/* <Box flex={1} /> */}
          </Stack>
        </Stack>
        <Box pt={4} display={["none", "block"]}>
          <Button fontSize="xl" fontWeight="black">
            History
          </Button>
        </Box>
        <Stack display={["none", "flex"]} rounded="sm" height={64} px={6} boxShadow="base" bg="white" overflowX="auto">
          <Stack isInline width="full" borderBottomWidth="1px" borderColor="gray.700" py={3}>
            {["Timestamp", "Type", "Size", "Strike Price", "Settlement Price", "Status"].map((item) => (
              <Box key={item} flex={1}>
                <Text textAlign="center" fontWeight="bold" textTransform="uppercase" fontSize="sm">
                  {item}
                </Text>
              </Box>
            ))}
          </Stack>
          <Stack overflowY="scroll" overflowX="auto" display={["none", "flex"]} textAlign="center">
            {snap.history.map((item) => (
              <Stack key={item.id} isInline width="full" fontSize="sm">
                <Box flex={1}>
                  <Text m={0}>{format(item.timestamp, "kk:mm:ss")}</Text>
                </Box>
                <Box flex={1}>
                  <Badge width={16} py={1} colorScheme={item.type === "up" ? "green" : "red"}>
                    {item.type}
                  </Badge>
                </Box>
                <Box flex={1}>
                  <Text m={0}>${item.size.toFixed(2)}</Text>
                </Box>
                <Box flex={1}>
                  <Text m={0}>${item.strikePrice.toFixed(3)}</Text>
                </Box>
                <Box flex={1}>
                  <Text m={0}>{item.settlementPrice === "pending" ? "..." : `$${item.settlementPrice.toFixed(3)}`}</Text>
                </Box>
                <Box flex={1}>
                  <Badge width={16} py={1} colorScheme={item.status === "pending" ? "" : item.status === "Win" ? "green" : "red"}>
                    {item.status === "pending" ? item.status : item.status}
                  </Badge>
                </Box>
              </Stack>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
}

// {
//   /* <HighchartsReact ref={chartComponent} highcharts={Highcharts} options={options} /> */
// }

// function useInitiChart({ data }) {
//   const chart = React.useRef(null)
//   React.useEffect(() => {
//     if (chart.current) return
//     const Highcharts = window.Highcharts
//     // console.log({ Highcharts })
//     if (!Highcharts || !data) return
//     if (!chart.current && Highcharts) {
//       chart.current = Highcharts

//       console.log(chart.current)

//     }
//     // Highcharts.getJSON(
//     //   "https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json",
//     //   function (data) {
//     //     console.log({ data })
//     // [[timestamp, value]]
//     chart.current.chart("container", {

//     });
//     // }
//     // );
//   }, [data]);
// }

// function useWS() {
//   const [point, setPoint] = React.useState();
//   const [price, setPrice] = React.useState<null | string>(null);
//   const prevPoint = usePrevious(point);

//   React.useEffect(() => {
//     const ws = new WebSocket("wss://stream.binance.com:9443/ws");
//     const msg = {
//       method: "SUBSCRIBE",
//       params: ["btcusdt@trade"],
//       id: 1,
//     };
//     ws.onopen = () => {
//       ws.send(JSON.stringify(msg));
//     };
//     ws.onmessage = (event) => {
//       const data = JSON.parse(event.data);
//       if (!data?.E || !data?.p) return
//       const newPoint = {
//         x: data.E,
//         y: +data.p,
//         // name: "Point2",
//         // color: "#00FF00"
//         // selected: true
//       }

//       setPrice(+data.p as any);
//       setPoint(newPoint as any);

//       return () => {
//         ws.close();
//       }
//     }
//   }, []);

//   return { point, price };
// }

function usePrevious(value) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = React.useRef();
  // Store current value in ref
  React.useEffect(() => {
    // console.log({ value })
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

// Highcharts.getJSON(
//   'https://cdn.jsdelivr.net/gh/highcharts/highcharts@v7.0.0/samples/data/usdeur.json',
//   function (data) {

//     Highcharts.chart('container', {
//       chart: {
//         zoomType: 'x'
//       },
//       title: {
//         text: 'USD to EUR exchange rate over time'
//       },
//       subtitle: {
//         text: document.ontouchstart === undefined ?
//           'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
//       },
//       xAxis: {
//         type: 'datetime'
//       },
//       yAxis: {
//         title: {
//           text: 'Exchange rate'
//         }
//       },
//       legend: {
//         enabled: false
//       },
//       plotOptions: {
//         area: {
//           fillColor: {
//             linearGradient: {
//               x1: 0,
//               y1: 0,
//               x2: 0,
//               y2: 1
//             },
//             stops: [
//               [0, Highcharts.getOptions().colors[0]],
//               [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
//             ]
//           },
//           marker: {
//             radius: 2
//           },
//           lineWidth: 1,
//           states: {
//             hover: {
//               lineWidth: 1
//             }
//           },
//           threshold: null
//         }
//       },

//       series: [{
//         type: 'area',
//         name: 'USD to EUR',
//         data: data
//       }]
//     });
//   }
// );
