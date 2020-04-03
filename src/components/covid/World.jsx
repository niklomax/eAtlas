import React, { useState } from 'react';
import {
  XYPlot, XAxis, YAxis,
  DiscreteColorLegend
} from 'react-vis';
import { format } from 'd3-format';

import { breakdown } from './utils';
import { VerticalBarSeries } from 'react-vis';
import { Slider } from 'baseui/slider';

export default React.memo((props) => {
  const [open, setOpen] = useState(props.isMobile === false);
  const [threshold, setThreshold] = useState([20000]);

  const { data, dark } = props;
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
          marginRight: !open ? -340 : 0,
          background: dark ? '#242730' : 'white',
          color: dark ? 'white' : 'black'
        }}
        className="right-panel-container">
        <div
          className="close-button"
          onClick={() => setOpen(!open)}
          style={{ color: 'white' }}>
          <i
            style={{
              //bottom and just outside the div
              marginLeft: -16,
              bottom: 0,
              position: 'absolute',
              fontSize: '2rem',
              background: dark ? '#242730' : 'white',
              color: dark ? 'white' : 'black'
            }}
            className={open ? "fa fa-arrow-circle-right" :
              "fa fa-arrow-circle-left"} />
        </div>
        <div>
          "xK countries"<Slider
            min={5000} max={70000} step={5000}
            value={[threshold]}
            onChange={({value}) => {
              setThreshold([value])
            }}
          />
          <XYPlot
            xType="ordinal" width={350}
            yDomain={[0, Math.max(...worldDeaths.map(e => e.y))]}
            height={200}>
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
            orientation="horizontal" width={300}
            items={["Cases", "Deaths"]} />
        </div>
      </div>
    );
  } else {
    return null
  }
});