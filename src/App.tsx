import React from "react";
import {
  Spacer, Flex, Button, Box, Stack, Text,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper
} from "@chakra-ui/react";
import { PriceChart } from "./PriceChart";
import { history } from "./mock-data";
import { proxy, useSnapshot } from 'valtio'

declare global {
  interface Window {
    Highcharts: any;
  }
}


const state = proxy({
  bid: 1,
  total: 1.005,
  setBid: (bid) => {
    state.bid = +bid
    state.total = +(state.bid + 0.005).toFixed(3)
  },
})

function useState() {
  return useSnapshot(state)
}

export default function App() {
  const chartContainerRef = React.useRef()
  const [containerSize, setSize] = React.useState(null)
  const point = useWS();
  const prevPoint = usePrevious(point)
  const snap = useState()

  React.useEffect(() => {
    const size = {
      // @ts-ignore
      width: chartContainerRef.current.offsetWidth,
      // @ts-ignore
      height: chartContainerRef.current.offsetHeight
    }
    console.log(size)
    setSize(size)
  }, [])
  // bg='linear-gradient(0deg, rgba(19, 68, 193, 0.4) 0%, rgba(0, 120, 255, 0.0)100%)'
  // bg='linear-gradient(0deg, rgba(19, 68, 193, 0.4) 0%, rgba(0, 120, 255, 0.0)100%)'

  // rgb(32,189,202)
  // linear-gradient(to right, rgb(32,189,202), rgb(21,43,67))
  return (
    <Stack
      height={["full", "100vh"]}
      minH={['100vh']}
      bg='gray.100'
      fontFamily='Roboto'
    // bgImage='linear-gradient(to bottom,rgb(32,189,202,0.5), rgb(21,43,67,0.5))'

    >
      <Stack height='full' maxW='8xl' mx='auto' width='full' p={4}>
        <Stack isInline fontSize={["xl", '3xl']} pb={[1, 4]} alignItems='center'>
          <Stack flex={1}>
            <Text m={0} fontWeight='black'>BTC-USDT</Text>
          </Stack>
          <Stack flex={1}>
            <Text textAlign={["right", 'center']} m={0} fontWeight='medium' color={prevPoint?.value > point?.value ? 'red.600' : 'green.600'}>{point?.value?.toFixed(2) || ''}</Text>
          </Stack>
          <Stack flex={1} display={['none', 'flex']}>
          </Stack>
        </Stack>
        <Stack flex={1} direction={['column', 'row']}>
          <Stack flex={1} width='full' height='full' ref={chartContainerRef} pr={[0, 6]} bg='transparent'>
            <PriceChart containerSize={containerSize} point={point} />
          </Stack>
          <Stack minW={['full', 'sm']}>
            <Stack rounded='sm' p={[4, 10]} boxShadow='base' spacing={5}
              bg='white'
            >
              <Text fontSize='sm' fontWeight='medium' >
                BTC 1 min binary options
              </Text>
              <FormControl id="bid" display='flex' alignItems='center'>
                <FormLabel mb={0} width={48} fontSize='base' fontWeight='semibold'>Order Size</FormLabel>
                <NumberInput min={1} defaultValue={snap.bid} onChange={snap.setBid} borderColor='gray.700' width={32}>
                  <NumberInputField rounded='sm' _hover={{}} />
                  <NumberInputStepper>
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
              </FormControl>
              <Stack fontSize='md' fontWeight='semibold' isInline justifyContent='space-between' alignItems='center'>
                <Box>
                  <Text m={0}>Fee</Text>
                </Box>
                <Box>
                  <Text m={0}>0.005</Text>
                </Box>
              </Stack>
              <Stack fontSize='md' fontWeight='semibold' isInline justifyContent='space-between' alignItems='center'>
                <Box>
                  <Text m={0}>Total</Text>
                </Box>
                <Box>
                  <Text m={0}>{snap.total}</Text>
                </Box>
              </Stack>

              <Stack isInline spacing={8} pt={[1, 4]}>
                <Button size='lg' width='full' rounded='sm' fontSize='lg' bg='green.600' boxShadow='lg' color='white' _hover={{
                  bg: 'green.500',
                  shadow: 'base',
                }}>Call &#8599;</Button>
                <Button size='lg' width='full' rounded='sm' fontSize='lg' bg='red.600' boxShadow='lg' color='white' _hover={{
                  bg: 'red.500',
                  shadow: 'base',
                }}>Put &#8600;</Button>
              </Stack>
            </Stack>
            {/* <Box flex={1} /> */}
          </Stack>
        </Stack>
        <Box pl={2} pt={4} display={['none', 'block']}>
          <Button fontSize='xl' fontWeight='black'>History</Button>
        </Box>
        <Stack display={['none', 'flex']} rounded='sm' height={64} p={6} boxShadow='base' bg='white' overflowX='auto' >
          <Stack isInline width='full' borderBottomWidth='1px' borderColor='gray.700' >
            {["Timestamp", 'Address', 'Type', "Size", 'Strike Px', 'Settlement Px', "Status"].map((item) => {
              return (
                <Box key={item} flex={1}>
                  <Text fontWeight='bold' textTransform='uppercase' fontSize='sm'>
                    {item}
                  </Text>
                </Box>
              )
            })}
          </Stack>
          <Stack overflowY='scroll' overflowX='auto' display={['none', 'flex']} >
            {history.map(item => {
              return (
                <Stack isInline width='full' fontSize='sm'>
                  <Box flex={1}>
                    <Text m={0}>{item.timestamp}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text m={0}>{item.address}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text m={0}>{item.type}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text m={0}>{item.size}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text m={0}>{item.strikepx}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text m={0}>{item.settlementpx}</Text>
                  </Box>
                  <Box flex={1}>
                    <Text m={0}>{item.status}</Text>
                  </Box>
                </Stack>
              )
            })}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

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


{/* <HighchartsReact ref={chartComponent} highcharts={Highcharts} options={options} /> */ }

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
