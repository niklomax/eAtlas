import React, { useState } from 'react';
// import {
//   XYPlot, XAxis, YAxis,
//   DiscreteColorLegend
// } from 'react-vis';
// import { format } from 'd3-format';
// import { Checkbox } from 'baseui/checkbox';
// import { RadioGroup, Radio } from "baseui/radio";
// import { VerticalBarSeries } from 'react-vis';
// import { Slider } from 'baseui/slider';
import {schemeTableau10} from 'd3-scale-chromatic';

// import { breakdown, countryHistory } from './utils';
import { fetchData } from '../../utils';
import { DEV_URL, PRD_URL } from '../../Constants';
import MultiLinePlot from '../Showcases/MultiLinePlot';
import MultiSelect from '../MultiSelect';
import './style.css';
import { isNumber } from '../../JSUtils';
const host = (process.env.NODE_ENV === 'development' ? DEV_URL : PRD_URL);

export default React.memo((props) => {
  const [minMax, setMinMax] = useState([200, 500]);
  const [{data, las, allHistory, regions, avg, lasHistory}, setData] = 
  useState({data:null, las:null, allHistory: {}, regions: []});
  const [filteredHistory, setFilteredHistory] = useState(null);

  const { dark } = props;

  if (!data) {
    initialState(setData, setFilteredHistory);
  }
  // console.log(avg);
  
  if (filteredHistory) {
    //list history
    // console.log(list);    
    const keys = Object.keys(filteredHistory);
    // console.log(keys[0]);
    
    filteredHistory.avg = avg;
    keys.push("avg")
    // console.log(filteredHistory);
    // console.log(schemeCategory10)

    // if(list.length) {
    //   keys.push(keys.splice(keys.indexOf(list[0]), 1)[0]);
    // }
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
              if(selected.length) {
                const newFilter = {}
                selected.forEach(e => newFilter[e.id] = lasHistory[e.id]);
                setFilteredHistory(newFilter)
              } else {
                setFilteredHistory(lasHistory);
              }
            }}
            // single={true}
          />
          {/* <Slider
            min={radio === "2" ? 1 : 0} 
            max={radio === "1" ? 11000 : 1000} step={50}
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
              .slice(filteredHistory[e].length - 30, filteredHistory[e].length))}
            legend={keys}
            title={"England or chosen vs Average"}
            plotStyle={{ 
              // width: W, 
              marginBottom: 60 }}
            noLimit={true}
            colors={keys.length <= 10 ?
              [...schemeTableau10.slice(0,keys.length-1), "#f00"] : 
              keys.map((e, i) => i === (keys.length - 1) ? '#f00' : '#777')
            }
            noLegend={keys.length > 10}
          />}
          <hr/>
      </>
    );
  } else {
    return null
  }
});

function initialState(setData, setFilteredHistory) {
  fetchData(host + "/api/covid19h", (data, error) => {
    if (!error) {
      const allHistory = {}, lasHistory = {}, regions = [];
      data.forEach(e => {
        const area = e['Area.name'], date = e['Specimen.date'], cum = e['Cumulative.lab.confirmed.cases'],
        isLAS = e['Area.type'] === "Upper tier local authority";
        // const num = area === 'England' ? cum / 100 : cum;
        if (isNumber(cum)) {
          if (allHistory[area]) {
            allHistory[area].push({ x: date, y: cum });
            if(isLAS) {
              lasHistory[area] = allHistory[area];
            }
          }
          else {
            allHistory[area] = [
              { x: date, y: cum }
            ];
          }
        }
        if (e['Area.type'] === 'Region') {
          regions.push(area);
        }
      });
      const las = Object.keys(lasHistory);

      //reverse 
      const orderByDate = {};
      Object.keys(allHistory).forEach(e => {
        orderByDate[e] = allHistory[e].sort((a,b) => new Date(a.x) > new Date(b.x))
        if(las.includes(e)) {
          lasHistory[e] = orderByDate[e];
        }
      })
      
      //add average
      const avg = [];
      allHistory[las[0]].forEach((xy, i) => {
        const y = Object.values(allHistory).reduce((sum, e) => 
        isNumber(sum) ? sum + ((e[i] && e[i].y )|| 0) : 
        sum[i].y + ((e[i] && e[i].y )|| 0));          
        avg.push({x: xy.x, y: Math.floor(y/las.length)})
      })      
      setData({ data, las, allHistory: orderByDate, regions, avg, lasHistory });
      setFilteredHistory(lasHistory);
    }
  });
}
