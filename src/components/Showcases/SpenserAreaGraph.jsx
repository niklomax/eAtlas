import React, { useState, useEffect } from 'react';
import { fetchData } from '../../utils';
import Constants from '../../Constants';
import MultiLinePlot from './MultiLinePlot';

const ROOT = (process.env.NODE_ENV === 'development' ? Constants.DEV_URL : Constants.PRD_URL);

const SpenserAreaGraph = (props) => {
  const { area, saey } = props;
  const [data, setData] = useState(null)

  // console.log(area);

  useEffect(() => {
    fetchData(ROOT + "/api/area?code=" + area, (result) => {
      // console.log(result);
      setData(result)
    })
  }, [area])
  
  if(!area || !data || !data.length) return null;
  // console.log(typeof(saey), typeof(data[0][0]))
  const sex = +(saey.substr(0, 1)); const oSex = sex === 1? 2:1;
  // console.log(sex, oSex);
  const years = data.filter(e => {
    // saey from data
    const v1 = (e[0] + "").replace((e[0] + "").substr(-4), '')
    // saey of this area
    const v2 = saey.replace(saey.substr(-4), '')
    return((v1 === v2)  || v1 === v2.replace(sex, oSex))
  });

  const sexes = [[], []];
  years.forEach(e => {
    if((e[0]+ "").startsWith(sex)) {
      // current
      sexes[0].push({x: +(e[0]+ "").substr(-4), y:e[1]})
    } else {
      sexes[1].push({x: +(e[0]+ "").substr(-4), y:e[1]})
    }
  });
  // console.log(sexes);

  return (
    <MultiLinePlot 
      // {x: 2012, y: 45}
      dark={props.dark}
      data={sexes}
      legend={[1,2].map(e => e === sex ? 'Male' : 'Female')}
      title="All years"
      plotStyle={{ height: 100, marginBottom: 50 }}
    />
  )
}

export default SpenserAreaGraph;