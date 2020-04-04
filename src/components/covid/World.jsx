import React, { useState } from 'react';
import {
  XYPlot, XAxis, YAxis,
  DiscreteColorLegend
} from 'react-vis';
import { format } from 'd3-format';

import { breakdown } from './utils';
import { VerticalBarSeries } from 'react-vis';
import { Slider } from 'baseui/slider';
import { fetchData } from '../../utils';
import { DEV_URL, PRD_URL } from '../../Constants';
const host = (process.env.NODE_ENV === 'development' ? DEV_URL : PRD_URL);

export default React.memo((props) => {
  const [threshold, setThreshold] = useState([20000]);
  const [data, setData] = useState(null);
  const { dark } = props;
  fetchData(host + "/api/covid19w", (d, error) => {
    if(!error) {
      setData(d.features)
    }
  })
  const notEmpty = data && data.length > 1;
  if (notEmpty) {
    let world = breakdown(data);
    world = Object.keys(world)
      .filter(e => world[e] > threshold[0])
      .map(e => ({ x: e, y: world[e] }));

    let worldDeaths = breakdown(data, "deaths");
    worldDeaths = Object.keys(worldDeaths)
      .filter(e => worldDeaths[e] > 1000)
      .map(e => ({ x: e, y: worldDeaths[e] }));

    return (
      <div
        style={{
          margin: 'auto',
          maxWidth: 800,
          background: dark ? '#242730' : 'white',
          color: dark ? 'white' : 'black'
        }}>
        <div>
          "xK countries"<Slider
            min={5000} max={100000} step={5000}
            value={[threshold]}
            onChange={({value}) => {
              setThreshold([value])
            }}
          />
          <XYPlot
            xType="ordinal" width={800} height={300}
            yDomain={[0, Math.max(...worldDeaths.map(e => e.y))]}>
            <YAxis tickLabelAngle={-45}
              tickFormat={v => format(".2s")(v)}
              style={{
                line: { strokeWidth: 0 },
                title: { fill: dark ? '#fff' : '#000' },
                text: { fill: dark ? '#fff' : '#000' }
              }} position="start" 
              // title={"30kCases+1kDeaths"} 
            />
            <XAxis tickLabelAngle={-45} />
            <VerticalBarSeries data={world} />
            <VerticalBarSeries data={worldDeaths} />
            {/* <LabelSeries 
            style={{text: {title: '#f00'}}}
            data={worldDeaths} getLabel={d => d.y} /> */}
          </XYPlot>
          <DiscreteColorLegend
            orientation="horizontal"
            items={["Cases", "Deaths"]} />
        </div>
      </div>
    );
  } else {
    return null
  }
});