import React from 'react';
import { XYPlot, XAxis, YAxis, LineSeries, MarkSeries,
  HorizontalRectSeries } from 'react-vis';
import { format } from 'd3-format';

const popPyramid = (options) => {
  if(!options || !options.data) return;
  // const d = [Array.apply(null, { length: 9 })
  //   .map(Number.call, Number).map(d => d + 2009)]
  //   .map((e, i) =>
  //     ({
  //       x: i % 2 ? 1 : -1,
  //       x0: (i % 2 ? 1 : -1) * (i + 5),
  //       y: e === 0 ? 2009 : e,
  //       y0: i % 2 ? (e - 1 + 5) : e + 5
  //     })
  //   )
  const W = 250;
  return (
    <XYPlot height={options.plotStyle && options.plotStyle.height || 250}
    width={options.plotStyle && options.plotStyle.width || W} >
      <HorizontalRectSeries data={options.data} />
      <YAxis
        style={{ text: { fill: '#fff' } }}
        left={(W / 2) - 10} />
    </XYPlot>
  )
}

const seriesPlot = (options) => {
  const ReactSeries = options.type;
  if (!ReactSeries) return null;
  const data = options.type !== MarkSeries &&
    options.data.length > 10 ? options.data.slice(0, 10)
    : options.data
  return options.data && options.data.length > 1 &&
    <>
      {options.type !== MarkSeries &&
        options.data && options.data.length > 10 &&
        <h4>Plotting first 10 values:</h4>}
      <XYPlot xType="ordinal"
        margin={{ bottom: options.margin || 40 }} // default is 40
        animation={{ duration: 1 }}
        height={options.plotStyle && options.plotStyle.height || 250}
        width={options.plotStyle && options.plotStyle.width || 250} >
        {!options.noXAxis && // if provided dont
          <XAxis position="right" tickLabelAngle={-45} style={{
            text: { fill: '#fff', fontWeight: 400 }
          }} />}
        {!options.noYAxis && // if provided dont
          <YAxis tickLabelAngle={-45} tickFormat={v => format(".2s")(v)} style={{
            title: { fill: '#fff' },
            text: { fill: '#fff', fontWeight: 400 }
          }} position="start" title={options.title} />
        }
        <ReactSeries
          onValueClick={options.onValueClick}
          onSeriesMouseOver={(event) => {
          }}
          style={{ fill: options.type === LineSeries ? 'none' : 'rgb(18, 147, 154)' }}
          data={data} />
      </XYPlot>
    </>;
}

export {
  seriesPlot,
  popPyramid
}