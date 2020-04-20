import React, { useState } from 'react';
// import { format } from 'd3-format';
// import { Checkbox } from 'baseui/checkbox';
// import { RadioGroup, Radio } from "baseui/radio";
// import { VerticalBarSeries } from 'react-vis';
// import { Slider } from 'baseui/slider';
import { schemeTableau10 } from 'd3-scale-chromatic';

import MultiLinePlot from '../Showcases/MultiLinePlot';
import MultiSelect from '../MultiSelect';
import './style.css';

export default React.memo((props) => {  
  const [minMax, setMinMax] = useState([200, 500]);
  const [{ las, avg, lasHistory }, setData] =
    useState({ las: null, avg: null, lasHistory: null });
  const [filteredHistory, setFilteredHistory] = useState(null);

  const { dark, onSelectCallback, hintXValue } = props;
  if (!filteredHistory && props.data) {        
    initialState(props.data, setData, setFilteredHistory);
  }

  if (filteredHistory) {
    //list history
    // console.log(list);    
    const keys = Object.keys(filteredHistory);
    // console.log(keys[0]);

    filteredHistory.avg = avg;
    keys.push("avg")
    // console.log(filteredHistory);
    // console.log(schemeCategory10)

    return (
      <>
        <MultiSelect
          dark={dark}
          title="Compare"
          values={
            (las && las.map(e =>
              ({ id: e, value: e }))) || []
          }
          onSelectCallback={(selected) => {
            // array of seingle {id: , value: } object
            // setList([...selected.map(e => e.id)]);
            if (selected.length) {
              const newFilter = {}
              selected.forEach(e => newFilter[e.id] = lasHistory[e.id]);
              setFilteredHistory(newFilter)
            } else {
              setFilteredHistory(lasHistory);
            }
            typeof onSelectCallback === 'function' &&
            onSelectCallback(selected)
          }}
        // single={true}
        />
        {/* <Slider
            min={1} 
            max={}
            value={minMax}
            onChange={({ value }) => {
              if (value && value[0] < value[1]) {
                setMinMax(value);
              }
            }}
          /> */}

        {
          <MultiLinePlot
            dark={dark}
            data={keys
              .map(e => filteredHistory[e]
                .slice(filteredHistory[e].length - 35, filteredHistory[e].length))}
            legend={keys}
            title={"England or chosen vs Average"}
            plotStyle={{
              // width: W, 
              marginBottom: 60
            }}
            noLimit={true}
            colors={keys.length <= 10 ?
              [...schemeTableau10.slice(0, keys.length - 1), "#f00"] :
              keys.map((e, i) => i === (keys.length - 1) ? '#f00' : '#777')
            }
            noLegend={keys.length > 10}
            hintXValue={(xValue) => typeof hintXValue === 'function' &&
            hintXValue(xValue)}
          />}
        <hr />
      </>
    );
  } else {
    return null
  }
});

function initialState(data, setData, setFilteredHistory) {
  const lasHistory = {};

  //add average
  const avg = []; let m = 0, utla;
  // find longest  
  Object.keys(data.utlas).map(e => {
    const cc = data.utlas[e].dailyTotalConfirmedCases;
    if(cc && cc.length > m) {
      m = cc.length; utla = data.utlas[e];
    }    
    lasHistory[data.utlas[e].name.value] = 
    data.utlas[e].dailyTotalConfirmedCases.map(v => ({x: v.date, y: v.value}))
  })
  const las = Object.keys(lasHistory);

  utla.dailyTotalConfirmedCases.map(v => {
    //e.date, e.value
    let y = v.value;
    //go through the rest and add values of same dates
    Object.keys(data.utlas).map(e => {
      const cc = data.utlas[e].dailyTotalConfirmedCases;
      cc.map(ov => {
        if(utla.name !== data.utlas[e].name.value) {
          if(ov.date === v.date) {
            y += ov.value
          }
        }
      })
    })
    avg.push({x: v.date, y: Math.floor(y / Object.keys(data.utlas).length)})
  })
  
  setData({ las, avg, lasHistory });
  setFilteredHistory(lasHistory);
}
