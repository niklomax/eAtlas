import React, { useState } from 'react';

import { Slider } from 'baseui/slider';
import { daysDiff } from './utils';
import MultiLinePlot from '../Showcases/MultiLinePlot';

export default (props) => {
  const { data, dark, tests } = props;  
  if(!data || data.length <= 2 ) return(null)
  const days = daysDiff(data[0].DateVal, data[data.length-1].DateVal)
  const [start, setStart] = useState(20);
  const [end, setEnd] = useState(days + 1);
  const [value, setValue] = useState([days - 30, days]);
  const [increase, setIncrease] = useState([22]);

  let sliced = data.slice(0, days);
  let testsSliced = tests.slice(0, days)
  if(end - start > 2) {
    sliced = data.slice(start, end);
    testsSliced = tests.slice(start, end);
  } else {
    setStart(start); 
    setEnd(days);
  }
  const slicedMulti = [[],[],[],[]];
  for(let i = 0; i < sliced.length; i++) {
    slicedMulti[0][i] = {
      x: sliced[i].DateVal,
      y: sliced[i].CumCases
    }
    slicedMulti[1][i] = {
      x: sliced[i].DateVal,
      y: sliced[i].CMODateCount
    }
    slicedMulti[2][i] = {
      x: sliced[i].DateVal,
      y: sliced[i].CumDeaths || 0
    }
    slicedMulti[3][i] = {
      x: sliced[i].DateVal,
      y: sliced[i].DailyDeaths || 0
    }
  }

  const expGrowth = [slicedMulti[0][0]];
  for (let i = 1; i < slicedMulti[0].length; i++) {
    const y = +(expGrowth[i - 1].y)
    expGrowth.push({
      x: slicedMulti[0][i].x,
      y: (y + y * (increase[0]/100)).toFixed(2)
    })
  }
  
  return(
    <>
      <MultiLinePlot
        dark={dark}
        data={
          [slicedMulti[1], slicedMulti[2], slicedMulti[3]]
        } legend={["DailyCases", "Death", "DailyDeaths"]}
        title={"DailyVsDeaths"} noXAxis={true}
        plotStyle={{ height: 200, marginBottom: 10 }}
      />
      
      <MultiLinePlot
        dark={dark}
        data={
          [slicedMulti[0],
            testsSliced.map(e => ({ x: e.x, y: e.y / 10 })),
            expGrowth
          ]
        } legend={["Cases", "Tests", increase + "%"]}
        title={"CasesVsTests÷10"}
        plotStyle={{ height: 200, marginBottom:60 }} noLimit={true}
      />
      {data[0].DateVal + " to " + data[days].DateVal}
      <Slider
        min={0} max={days}
        value={value}
        onChange={({value}) => {
          value && setValue(value)
          setStart(value[0]); 
          setEnd(value[1]);
        }}
        overrides={{
          MinValue: ({$min}) => data[0][$min].x
        }}
      />
      "Increase %"<Slider
        min={1} max={100}
        value={[increase]}
        onChange={({value}) => {
          setIncrease([value])
        }}
      />
    </>
  )
}
