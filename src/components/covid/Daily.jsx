import React, { useState } from 'react';

import { Slider } from 'baseui/slider';

import MultiLinePlot from '../Showcases/MultiLinePlot';
import MultiSelect from '../MultiSelect';

export default (props) => {
  const { data, dark, tests } = props;  
  if(!data || data.length <= 2 ) return(null)
  const days = daysDiff(data[0].DateVal, data[data.length-1].DateVal)
  const [start, setStart] = useState(20);
  const [end, setEnd] = useState(days + 1);
  const [value, setValue] = useState([days - 30, days]);
  const [increase, setIncrease] = useState([23]);

  let sliced = data.slice(0, days);
  let testsSliced = tests.slice(0, days)
  if(end - start > 2) {
    sliced = data.slice(start, end);
    testsSliced = tests.slice(start, end);
  } else {
    setStart(start); 
    setEnd(days);
  }

  sliced = [
    sliced.map(e => ({
      x: e.DateVal,
      y: e.CumCases
    })),
    sliced.map(e => ({
      x: e.DateVal,
      y:e.CMODateCount
    })),
    sliced.map(e =>({
      x: e.DateVal || null,
      y: e.CumDeaths || 0
    })),
    sliced.map(e =>({
      x: e.DateVal || null,
      y: e.DailyDeaths || 0
    }))
  ];

  const expGrowth = [sliced[0][0]];
  for (let i = 1; i < sliced[0].length; i++) {
    const y = +(expGrowth[i - 1].y)
    expGrowth.push({
      x: sliced[0][i].x,
      y: (y + y * (increase[0]/100)).toFixed(2)
    })
  }
  
  return(
    <>
      <MultiLinePlot
        dark={dark}
        data={
          [sliced[1], sliced[2], sliced[3]]
        } legend={["DailyCases", "Death", "DailyDeaths"]}
        title={"DailyVsDeaths"} noXAxis={true}
        plotStyle={{ height: 200, marginBottom: 10 }}
      />
      
      <MultiLinePlot
        dark={dark}
        data={
          [sliced[0],
            testsSliced.map(e => ({ x: e.x, y: e.y / 10 })),
            expGrowth
          ]
        } legend={["Cases", "Tests", "23%"]}
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

const daysDiff = (s, e) => {
  const start = new Date(s);
  const end = new Date(e);
  let diff = end.getTime() - start.getTime();
  diff = diff / (1000 * 3600 * 24);
  return diff;
}
