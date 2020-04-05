import React, { useState } from 'react';
import {
  XYPlot, XAxis, YAxis,
  DiscreteColorLegend
} from 'react-vis';
import { format } from 'd3-format';

import { breakdown, countryHistory } from './utils';
import { VerticalBarSeries } from 'react-vis';
import { Slider } from 'baseui/slider';
import { fetchData } from '../../utils';
import { DEV_URL, PRD_URL } from '../../Constants';
import MultiLinePlot from '../Showcases/MultiLinePlot';
import { Checkbox } from 'baseui/checkbox';
const host = (process.env.NODE_ENV === 'development' ? DEV_URL : PRD_URL);

export default React.memo((props) => {
  const [threshold, setThreshold] = useState([20000]);
  const [minMax, setMinMax] = useState([200, 500]);
  const [checked, setChecked] = useState(false);
  const [data, setData] = useState(null);
  const { dark } = props;
  if (!data) {
    fetchData(host + "/api/covid19w", (d, error) => {
      if (!error) {
        setData(d.features)
      }
    })
  }
  const notEmpty = data && data.length > 1;
  if (notEmpty) {
    let countryHistories = 
    countryHistory(data, "cases", minMax[0], minMax[1], checked);
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
            onChange={({ value }) => {
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
          <Slider
            min={0} max={11000} step={50}
            value={minMax}
            onChange={({ value }) => {
              if(value && value[0] < value[1]) {
                setMinMax(value);
              }
            }}
          />
          <Checkbox
            checked={checked}
            onChange={e => setChecked(e.target.checked)}
          >
            USA
          </Checkbox>
          <MultiLinePlot
            dark={dark}
            data={Object.keys(countryHistories).map(e => countryHistories[e])}
            legend={Object.keys(countryHistories)}
            title={minMax[0] + "<Cases< " + minMax[1] + ": " + 
            Object.keys(countryHistories).length + 
            (Object.keys(countryHistories).length > 1 ? " countries" : "country")}
            plotStyle={{ width: 800, marginBottom: 60 }}
            noLimit={true}
          />

        </div>
      </div>
    );
  } else {
    return null
  }
});