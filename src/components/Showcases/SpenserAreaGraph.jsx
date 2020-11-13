import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils';
import Constants from '../../Constants';
import MultiLinePlot from './MultiLinePlot';

const ROOT = (process.env.NODE_ENV === 'development' ? Constants.DEV_URL : Constants.PRD_URL);

const SpenserAreaGraph = (props) => {
  const { area, saey, households } = props;
  const [data, setData] = useState(null)
  useEffect(() => {
    const fullURL = ROOT + "/api/area?code=" + area + (households ? "&hh=true" : "");
    fetchData(fullURL, (result, error) => {
      if(!error) {
        setData(result)
      } else {
        console.log(error);
      }
    })
  }, [area, households])

  if (!area || !data || !data.length) return null;
  if (households) {
    return (
      <MultiLinePlot
        // {x: 2012, y: 45}
        dark={props.dark}
        // data={Object.keys(ages).map(i => ages[i].map(e => ({x: +(e[0]+ "").substr(-4), y:e[1]})))}
        // legend={Object.keys(ages).map(i => "Range " + (i + 1))}
        legend={["Total"]}
        // .map(e => ({x:e[1], y: +(e[0]+"").substr((e[0]+"").length - 4)}))
        data={[data.map(e => ({ x: e[0], y: e[1] }))]}
        title="Total Households"
        plotStyle={{ height: 150, marginBottom: 50 }}
      />
    )
  }
  // console.log(typeof(saey), typeof(data[0][0]))
  const sex = +(saey.substr(0, 1)); const oSex = sex === 1 ? 2 : 1;
  // console.log(sex, oSex);
  const ages = [];
  const years = data.filter(e => {
    const age = +((e[0] + "").substr(1, 1));
    let ageIndex = ages.length;
    // const xy = {x: +(e[0]+ "").substr(-4), y:e[1]};
    if (Object.keys(ages).length === 0) { //first run
      ages[ageIndex] = [];
      ages[ageIndex].push(e)
    } else {
      Object.keys(ages).forEach(i => {
        if (+((ages[i][0] + "").substr(1, 1)) === age) {
          ageIndex = +i
        }
      })
      if (ageIndex === ages.length) { //new age
        ages[ageIndex] = [];
      }
      // console.log(age)
      ages[ageIndex].push(e)
    }
    // saey from data
    const v1 = (e[0] + "").replace((e[0] + "").substr(-4), '')
    // saey of this area
    const v2 = saey.replace(saey.substr(-4), '')
    return ((v1 === v2) || v1 === v2.replace(sex, oSex))
  });

  let sexes = [{}, {}];
  let population = {};
  years.forEach(e => {
    // e[0] is saey and e[1] is pop
    const year = +(e[0] + "").substr(-4);
    population[year] = e[1];
    // separate sexes by checking starting 1 or 2
    if ((e[0] + "").startsWith(sex)) {
      // current
      sexes[0][year] = e[1]
    } else {
      sexes[1][year] = e[1]
    }
  });
  // order them
  sexes.forEach((each, i) => {
    sexes[i] = Object.keys(each).sort().map(yy => ({ x: yy, y: each[yy] }))
  })
  population = Object.keys(population).sort().map(yy => ({ x: +yy, y: population[yy] }))
  // console.log(population);
  return (
    <MultiLinePlot
      // {x: 2012, y: 45}
      dark={props.dark}
      // data={Object.keys(ages).map(i => ages[i].map(e => ({x: +(e[0]+ "").substr(-4), y:e[1]})))}
      // legend={Object.keys(ages).map(i => "Range " + (i + 1))}
      legend={["Total"]}
      // .map(e => ({x:e[1], y: +(e[0]+"").substr((e[0]+"").length - 4)}))
      data={[population]}
      // legend={[1,2].map(e => e === sex ? 'Male' : 'Female')}
      title="Total Population by sexes"
      plotStyle={{ height: 150, marginBottom: 50 }}
    />
  )
}

export default SpenserAreaGraph;