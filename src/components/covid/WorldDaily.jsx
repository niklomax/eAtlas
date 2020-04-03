import React, { useState } from 'react';

import { Slider } from 'baseui/slider';
import MultiLinePlot from '../Showcases/MultiLinePlot';
import MultiSelect from '../MultiSelect';
import { Table } from 'baseui/table';

export default React.memo((props) => {
  const { data, dark } = props;
  if(!data || data.length < 1000) return(null)

  const [country, setCountry] = useState("GBR"); //countryterritoryCode
  let today = {
    cases: 0, deaths: 0,
    newCases: 0, newDeaths: 0
  };
  let ch = []
  let countries = new Set()
  data.forEach(element => {
    const {day, month, cases, deaths,
      countryterritoryCode} = element.properties;
    countryterritoryCode && countries.add(countryterritoryCode)
    today.cases += +(cases);
    today.deaths += +(deaths);
    const d = new Date();
    if(day === d.getDate() && month === (d.getMonth()+1)) {
      today.newCases += cases;
      today.newDeaths += deaths;
      // console.log(element);
    }
    if(countryterritoryCode === country) {
      ch.push(element)
    }
  });
  ch = ch.reverse();
  const days = ch.length;
  
  const [countryHistory, setCountryHistory] = useState(ch);
  const [start, setStart] = useState(days - 30);
  const [end, setEnd] = useState(days + 1);
  const [value, setValue] = useState([days - 30, days]);
  const [increase, setIncrease] = useState([23]);

  let sliced = countryHistory.slice(0, days);
  if(end - start > 2) {
    sliced = countryHistory.slice(start, end);
  } else {
    setStart(start); 
    setEnd(days);
  }

  if(sliced.length === 0) {
    setCountry("GBR")
  }
  
  return(
    <>
      <Table 
        columns={Object.keys(today).slice(0,2)} 
        data={[Object.values(today).slice(0,2)]}/>
      <Table 
        columns={Object.keys(today).slice(2,4)} 
        data={[Object.values(today).slice(2,4)]}/>
      <MultiSelect
        title={country}
        single={true}
        values={Array.from(countries).map(e => ({id:e, value:e}))}
        onSelectCallback={(selected) => {
          // array of seingle {id: , value: } object  
          setCountry(selected[0].value);
          setCountryHistory(data.filter(e => 
            e.properties.countryterritoryCode === 
            selected[0].value).reverse());
        }}
      />
      <Slider
        min={0} max={days}
        value={value}
        onChange={({value}) => {
          value && setValue(value);
          setStart(value[0]); 
          setEnd(value[1]);
        }}
      />
      <MultiLinePlot
        dark={dark}
        data={
          [sliced.map(e => ({x:e.properties.dateRep, 
            y:e.properties.cases})),
            sliced.map(e => ({x: e.properties.dateRep, 
              y: e.properties.deaths}))
          ]
        } 
        legend={["DailyCases", "DailyDeath"]}
        title={"DailyVsDeaths"} noXAxis={true}
        plotStyle={{ height: 200, marginBottom: 10 }}
      />
    </>
  )
})
