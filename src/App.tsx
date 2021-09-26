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
  Progress,
  Spinner,
  CircularProgress,
  CircularProgressLabel,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Icon,
} from "@chakra-ui/react";
import { PriceChart } from "./PriceChart";
import { history } from "./mock-data";
import { useStore } from "./store";
import { format, formatDistance, formatRelative, subDays } from "date-fns";
import { FiTrendingDown, FiTrendingUp } from "react-icons/fi";

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
    // console.log(size);
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
      bg="gray.200"
      fontFamily="Roboto"
      pb={2}
      // bgImage="linear-gradient(to bottom, rgb(32,189,202, 0), rgb(32,189,202, 0.))"
    >
      <Stack height="full" maxW="8xl" mx="auto" width="full" p={[0, 4]}>
        <Stack flex={1} direction={["column", "row"]} spacing={[0, 10]}>
          <Stack flex={1} width="full" height="full" spacing={[0, 2]}>
            <Stack p={[2, 0]} isInline fontSize={["xl", "3xl"]} pb={[1, 4]} alignItems="center" justifyContent="space-between">
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
          <Stack minW={["full", "sm"]} spacing={0} px={[2, 0]}>
            <Stack>
              <Stack spacing={0} pb={[3]} pt={[3, 0]}>
                <Box>
                  <Text m={0} fontSize={["2xl", "3xl"]} fontWeight="medium">
                    Balance: ${snap.balance.toFixed(2)}
                  </Text>
                </Box>
                <Box>
                  <Text m={0} fontSize={["xs", "sm"]} fontWeight="medium">
                    Profit / Loss: ${snap.winAmount.toFixed(2)} / ${snap.lossAmount.toFixed(2)}
                  </Text>
                </Box>
              </Stack>
              <Stack
                p={[4, 6]}
                boxShadow="base"
                bg="white"
                spacing={[2, 5]}
                // roundedTopLeft="3xl"
                // roundedTopRight="3xl"
                rounded="3xl"
              >
                <Text fontSize="sm" fontWeight="medium">
                  BTC 1 min binary options
                </Text>
                <FormControl id="bid" display="flex" alignItems="center">
                  <FormLabel mb={0} width={48} fontSize="base" fontWeight="semibold">
                    Order Size
                  </FormLabel>
                  <NumberInput
                    defaultValue={snap.bid}
                    onChange={snap.setBid}
                    min={1}
                    precision={0}
                    step={1}
                    borderColor="gray.700"
                    width={32}
                  >
                    <NumberInputField rounded="md" _hover={{}} />
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
                    <Text m={0} fontWeight="normal">
                      $0
                    </Text>
                  </Box>
                </Stack>
                <Stack fontSize="md" fontWeight="semibold" isInline justifyContent="space-between" alignItems="center">
                  <Box>
                    <Text m={0}>Total</Text>
                  </Box>
                  <Box>
                    <Text m={0} fontWeight="normal">
                      ${snap.total}
                    </Text>
                  </Box>
                </Stack>
              </Stack>

              <Stack isInline spacing={6} py={[2, 4]}>
                <Button
                  onClick={() => snap.addMarker("call")}
                  size="lg"
                  width="full"
                  rounded="3xl"
                  fontSize="lg"
                  bg="green.300"
                  color="green.900"
                  boxShadow="base"
                  _active={{}}
                  _hover={{
                    bg: "green.200",
                    color: "green.800",
                    boxShadow: "base",
                  }}
                  isDisabled={snap.isBetDisabled}
                >
                  Call
                  <Box pl={1}>
                    <Icon as={FiTrendingUp} />
                  </Box>
                </Button>
                <Button
                  onClick={() => snap.addMarker("put")}
                  size="lg"
                  width="full"
                  rounded="3xl"
                  fontSize="lg"
                  bg="red.300"
                  color="red.900"
                  boxShadow="base"
                  _active={{}}
                  _hover={{
                    bg: "red.200",
                    color: "red.800",
                    boxShadow: "base",
                  }}
                  isDisabled={snap.isBetDisabled}
                >
                  Put
                  <Box pl={1}>
                    <Icon as={FiTrendingDown} />
                  </Box>
                </Button>
              </Stack>
            </Stack>
          </Stack>
        </Stack>
        <Box pt={8} display={["none", "block"]}>
          <Button fontSize="xl" fontWeight="black" bg="gray.200" _hover={{}}>
            History
          </Button>
        </Box>

        <Stack fontSize="sm" px={2} display={["flex", "none"]}>
          {snap.history.length > 0 &&
            snap.history.map((item) => (
              <Stack key={item.id} boxShadow="base" rounded="3xl" p={4} bg="white">
                <MobileListItem
                  name="Status"
                  renderValue={() => {
                    if (item.status === "pending") {
                      return (
                        <Box width={20}>
                          <Progress hasStripe value={(item.secondsLeft * 100) / 60} colorScheme="gray" />
                        </Box>
                      );
                    } else {
                      return (
                        <Badge minW={20} py={0} colorScheme={item.status === "Won" ? "green" : "red"}>
                          {item.status} ${item.result.toFixed(2)}
                        </Badge>
                      );
                    }
                  }}
                />
                <MobileListItem
                  name="Type"
                  renderValue={() => (
                    <Badge textAlign="center" width={20} py={0} colorScheme={item.type === "call" ? "green" : "red"}>
                      {item.type}
                    </Badge>
                  )}
                />
                <MobileListItem name="Timestamp" renderValue={() => <Text m={0}>{format(item.timestamp, "dd-MM-yyyy kk:mm")}</Text>} />
                <MobileListItem
                  name="Size"
                  renderValue={() => (
                    <Text textAlign="center" m={0}>
                      ${item.size.toFixed(2)}
                    </Text>
                  )}
                />
                <MobileListItem name="Strike Price" renderValue={() => <Text m={0}>${item.strikePrice.toFixed(3)}</Text>} />
                <MobileListItem
                  name="Settlement Price"
                  renderValue={() => (
                    <Text m={0}>
                      {item.settlementPrice === "pending" ? <Spinner size="xs" thickness="1px" /> : `$${item.settlementPrice.toFixed(3)}`}
                    </Text>
                  )}
                />
              </Stack>
            ))}
        </Stack>

        <Box display={["none", "block"]} rounded="3xl" boxShadow="base" bg="white" pb={3}>
          <Stack isInline width="full" pt={3} pb={2}>
            {["Timestamp", "Type", "Size", "Strike Price", "Settlement Price", "Status"].map((item) => (
              <Box key={item} flex={1}>
                <Text textAlign="center" fontWeight="bold" textTransform="uppercase" fontSize="xs">
                  {item}
                </Text>
              </Box>
            ))}
          </Stack>
          <Stack overflowY="scroll" textAlign="center" height={48}>
            {snap.history.length > 0 ? (
              snap.history.map((item) => (
                <Stack key={item.id} isInline width="full" fontSize="sm" alignItems="center">
                  <Stack flex={1} isInline justifyContent="center" alignItems="center">
                    <Text m={0}>{format(item.timestamp, "dd-MM-yyyy kk:mm")}</Text>
                  </Stack>
                  <Stack flex={1} isInline justifyContent="center" alignItems="center" py={1}>
                    <Badge width={20} py={0} colorScheme={item.type === "call" ? "green" : "red"}>
                      {item.type}
                    </Badge>
                  </Stack>
                  <Stack flex={1} isInline justifyContent="center" alignItems="center">
                    <Text m={0}>${item.size.toFixed(2)}</Text>
                  </Stack>
                  <Stack flex={1} isInline justifyContent="center" alignItems="center">
                    <Text m={0}>${item.strikePrice.toFixed(3)}</Text>
                  </Stack>
                  <Stack flex={1} isInline justifyContent="center" alignItems="center">
                    <Text m={0}>
                      {item.settlementPrice === "pending" ? <Spinner size="xs" thickness="1px" /> : `$${item.settlementPrice.toFixed(3)}`}
                    </Text>
                  </Stack>
                  <Stack flex={1} isInline justifyContent="center" alignItems="center">
                    {item.status === "pending" ? (
                      <Box width={20}>
                        <Progress hasStripe value={(item.secondsLeft * 100) / 60} colorScheme="gray" />
                      </Box>
                    ) : (
                      <Badge minW={20} py={0} colorScheme={item.status === "Won" ? "green" : "red"}>
                        {item.status} ${item.result.toFixed(2)}
                      </Badge>
                    )}
                  </Stack>
                </Stack>
              ))
            ) : (
              <Box pt={12}>
                <Text fontWeight="bold" color="gray.400">
                  No history
                </Text>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Stack>
  );
}

function MobileListItem({ name, renderValue }) {
  return (
    <Stack isInline alignItems="center" justifyContent="space-between">
      <Box>
        <Text fontWeight="medium">{name}</Text>
      </Box>
      <Stack width="50%" isInline justifyContent="center">
        {renderValue()}
      </Stack>
    </Stack>
  );
}

// {
//   /* <CircularProgress thickness="10px" color="rgba(33, 150, 243, 1)" size={6} value={(item.secondsLeft * 100) / 5}>
//                           <CircularProgressLabel fontSize="11px">{item.secondsLeft}</CircularProgressLabel>
//                         </CircularProgress> */
// }

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
