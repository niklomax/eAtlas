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
  const years = data.filter(e => {
    const v1 = (e[0] + "").replace((e[0] + "").substr(-4), '')
    const v2 = saey.replace(saey.substr(-4), '')
    return(v1 === v2)
  }).map(e => ({x: +(e[0]+ "").substr(-4), y:e[1]}));

  // console.log(years);

  return (
    <MultiLinePlot 
      // {x: 2012, y: 45}
      data={[years]}
      legend={['Saey: ' + saey]}
      title="All years"
      plotStyle={{ height: 100, marginBottom: 50 }}
    />
  )
}

export default SpenserAreaGraph;