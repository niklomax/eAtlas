import React from 'react';
import {
  Tabs, Tab, FormGroup, InputGroup,
  FormControl, Glyphicon, Checkbox
} from 'react-bootstrap';
import { Button, KIND, SIZE } from 'baseui/button';

import './DeckSidebar.css';
import DataInput from '../DataInput';
import MapboxBaseLayers from '../MapboxBaseLayers';
import {
  xyObjectByProperty, percentDiv,
  searchNominatom,
  humanize, generateLegend, sortNumericArray
} from '../../utils';
import Variables from '../Variables';
import RBAlert from '../RBAlert';
import { propertyCount, getPropertyValues } from '../../geojsonutils';
import { DEV_URL, PRD_URL, LAYERSTYLES } from '../../Constants';
import ColorPicker from '../ColourPicker';
import Modal from '../Modal';
import DataTable from '../Table';

import { yearSlider } from '../Showcases/Widgets';
import { crashes_plot_data } from '../Showcases/Plots';
import { isNumber } from '../../JSUtils';
import MultiSelect from '../MultiSelect';
import AddVIS from '../AddVIS';
import Daily from '../covid/Daily';
import WorldDaily from '../covid/WorldDaily';


const URL = (process.env.NODE_ENV === 'development' ? DEV_URL : PRD_URL);

export default class DeckSidebar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      radius: 100,
      elevation: 4,
      year: "",
      reset: false,
      multiVarSelect: {},
      barChartVariable: "TotalCases",
      datasetName: props.datasetName
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { data, alert, loading, daily, tests } = this.props;
    const { elevation, radius, reset,
      barChartVariable } = this.state;
    // avoid rerender as directly
    if (reset !== nextState.reset ||
      elevation !== nextState.elevation ||
      radius !== nextState.radius ||
      alert !== nextProps.alert ||
      loading !== nextProps.loading ||
      barChartVariable !== nextState.barChartVariable ||
      daily !== nextProps.daily ||
      tests !== nextProps.tests) return true;
    //TODO:  a more functional way is needed        
    if (data && nextProps && nextProps.data &&
      JSON.stringify(data) === JSON.stringify(nextProps.data)) {
      return false
    }
    return true;
  }

  /**
   * Render the sidebar empty if no data is loaded.
   * Partly because we like to load from a URL.
   */
  render() {
    const { elevation, radius, year, datasetName,
      subsetBoundsChange, multiVarSelect, barChartVariable } = this.state;
    const { onChangeRadius, onChangeElevation,
      onSelectCallback, data, colourCallback, daily, tests,
      toggleSubsetBoundsChange, urlCallback, alert,
      onlocationChange, column, dark, toggleOpen, toggleHexPlot } = this.props;
    let plot_data = [];
    let plot_data_multi = [[], []];
    const notEmpty = data && data.length > 1;
    plot_data = crashes_plot_data(notEmpty, data, plot_data, plot_data_multi);
    const severity_data = propertyCount(data, "accident_severity");
    let columnDomain = [];
    const columnData = notEmpty ?
      xyObjectByProperty(data, column || barChartVariable) : [];
    const regions = data && data.length > 0 && datasetName.endsWith("19") ?
      getPropertyValues(this.props.unfiltered, 'name') : [];
    const geomType = notEmpty && data[0].geometry.type.toLowerCase();
    // console.log(regions);
    if (notEmpty && column && (geomType === 'polygon' ||
      geomType === 'multipolygon' || "linestring") &&
      isNumber(data[0].properties[column])) {
      // we dont need to use generateDomain(data, column)
      // columnData already has this in its x'es
      columnDomain = columnData.map(e => e.x);
      // we will just sort it        
      columnDomain = sortNumericArray(columnDomain);
      // console.log(columnDomain);

      this.props.showLegend(
        generateLegend(
          {
            domain: columnDomain,
            title: humanize(column)
          }
        )
      );
    }
    const resetState = (urlOrName, reset = true) => {
      this.setState({
        reset: reset,
        year: "",
        multiVarSelect: {},
        barChartVariable: "TotalCases",
        datasetName: urlOrName || this.state.datasetName
      })
    }
    let d = new Date();
    d = new Date(d - d.getMinutes() * 60000 - d.getSeconds() * 1000)
    return (
      <>
        <div
          style={{
            color: dark ? "white" : "black",
            background: dark ? "#242730" : "white"
          }}
          className="side-panel">
          <RBAlert alert={alert} />
          <div
            style={{
              background: dark ? '#29323C' : '#eee'
            }}
            className="side-pane-header">
            {
              //if specific region shown, show its count
              multiVarSelect.name && multiVarSelect.name.size === 1 ?
                <h2>
                  {data[0].properties.TotalCases + " cases"}
                </h2>
                :
                (data && data.length && data[0].properties.TotalCases) ?
                  <h2>
                    {(this.state.TotalCases ||
                      daily && daily[0] && daily[daily.length - 1].CumCases) + " cases"}
                  </h2>
                  :
                  <h2>{data && data.length ?
                    data && data.length && data[0].properties.cases &&
                      data.reduce((t, next) => 
                      isNumber(t) ? t + +(next.properties.cases) : 
                      +(t.properties.cases) + +(next.properties.cases)) + " cases"
                    : "Nothing to show"}
                  </h2>
            }
            dataset: {this.state.datasetName}
          </div>
          <div>
            updated: {d.toLocaleString()}
            <br />
            <DataInput
              toggleOpen={() => typeof toggleOpen === 'function' && toggleOpen()}
              urlCallback={(url, geojson, name) => {
                resetState(url || name);
                typeof (urlCallback) === 'function'
                  && urlCallback(url, geojson);
                typeof (toggleOpen) === 'function' && toggleOpen()
              }
              } />
            <Modal
              toggleOpen={() => typeof toggleOpen === 'function' && toggleOpen()}
              component={<DataTable data={data} />} />
            {
              this.state.reset &&
              <Button
                kind={KIND.secondary} size={SIZE.compact}
                onClick={() => {
                  resetState("/api/covid19", false);
                  typeof (urlCallback) === 'function'
                    && urlCallback(URL + "/api/covid19");
                  typeof (this.props.showLegend) === 'function' &&
                    this.props.showLegend(false);
                }}>Reset</Button>
            }
          </div>
          <div className="side-panel-body">
            <div className="side-panel-body-content">
              {/* <DateSlider data={yy} multiVarSelect={multiVarSelect}
                  onSelectCallback={(changes) => console.log(changes)} 
                  callback={(changes) => console.log(changes)}/> */}
              {/* range of two values slider is not native html */
                yearSlider({
                  data, year, multiVarSelect,
                  // for callback we get { year: "",multiVarSelect }
                  onSelectCallback, callback: (changes) => this.setState(changes)
                })
              }
              {/* TODO: generate this declaritively too */}
              {
                severity_data && severity_data.map(each =>
                  percentDiv(each.x, 100 * each.y / data.length, () => {
                    if (multiVarSelect && multiVarSelect['accident_severity'] &&
                      multiVarSelect['accident_severity'].has(each.x)) {
                      delete multiVarSelect['accident_severity'];
                    } else {
                      multiVarSelect['accident_severity'] = new Set([each.x]);
                      this.setState({ multiVarSelect })
                    }
                    onSelectCallback &&
                      onSelectCallback(Object.keys(multiVarSelect).length === 0 ?
                        { what: '' } : { what: 'multi', selected: multiVarSelect })
                  }, dark))
              }
              <hr style={{ clear: 'both' }} />
              {data && data.length > 0 && datasetName.endsWith("19") &&
                <MultiSelect
                  title={"Country|Region"}
                  single={true}
                  values={regions.map(e => ({ id: e, value: e }))}
                  onSelectCallback={(selected) => {
                    // array of seingle {id: , value: } object
                    if (selected[0]) {
                      multiVarSelect['name'] = new Set([selected[0].id])
                    } else {
                      if (multiVarSelect.name) delete multiVarSelect.name;
                    }
                    this.setState({
                      multiVarSelect
                    })
                    typeof onSelectCallback === 'function' &&
                      onSelectCallback({
                        what: 'multi',
                        selected: multiVarSelect
                      });
                  }}
                />
              }
              {daily && tests && datasetName.endsWith("covid19") &&
                <Daily data={daily} tests={tests} dark={dark} />}
              {notEmpty && datasetName.endsWith("covid19w") &&
                <WorldDaily data={data} dark={dark} />}
              <Tabs defaultActiveKey={"1"} id="main-tabs">
                <Tab eventKey="1" title={
                  <i style={{ fontSize: '2rem' }}
                    className="fa fa-info" />
                }>
                  {/* pick a column and vis type */}
                  <AddVIS data={data} dark={dark} plotStyle={{
                    marginBottom: 80
                  }} />

                </Tab>
                <Tab eventKey="2" title={
                  <i style={{ fontSize: '2rem' }}
                    className="fa fa-sliders" />
                }>
                  {notEmpty &&
                    <div>
                      <ColorPicker colourCallback={(color) =>
                        typeof colourCallback === 'function' &&
                        colourCallback(color)} />
                      <input
                        type="range"
                        id="radius"
                        min={50}
                        max={1000}
                        step={50}
                        value={radius}
                        onChange={(e) => {
                          this.setState({
                            radius: e.target.value,
                          })
                          typeof (onChangeRadius) === 'function' &&
                            onChangeRadius(e.target.value)
                        }}
                      />
                      <h5>Radius: {radius}.</h5>
                      <input
                        type="range"
                        id="elevation"
                        min={2}
                        max={8}
                        step={2}
                        value={elevation}
                        onChange={(e) => {
                          this.setState({
                            elevation: e.target.value
                          })
                          typeof (onChangeElevation) === 'function' &&
                            onChangeElevation(e.target.value)
                        }}
                      />
                      <h5>Elevation: {elevation}.</h5>
                    </div>
                  }
                  {notEmpty &&
                    <>
                      <h6>Deck Layer:</h6>
                      <MultiSelect
                        title="Choose Layer"
                        single={true}
                        values={
                          LAYERSTYLES.map(e =>
                            ({ id: humanize(e), value: e }))
                        }
                        onSelectCallback={(selected) => {
                          // array of seingle {id: , value: } object
                          const newBarChartVar = (selected && selected[0]) ?
                            selected[0].value : barChartVariable;
                          this.setState({
                            barChartVariable: newBarChartVar
                          });
                          typeof onSelectCallback === 'function' &&
                            onSelectCallback({
                              what: 'layerStyle', selected: newBarChartVar
                            });
                        }}
                      />
                    </>
                  }
                  Map Styles
                  <br />
                  <MapboxBaseLayers
                    onSelectCallback={(selected) =>
                      onSelectCallback &&
                      onSelectCallback({
                        selected: selected,
                        what: 'mapstyle'
                      })
                    }
                  />
                  <Checkbox
                    onChange={() => toggleHexPlot && toggleHexPlot()}
                  >Hex Plot</Checkbox>
                  <Checkbox
                    onChange={() => {
                      this.setState({ subsetBoundsChange: !subsetBoundsChange })
                      if (toggleSubsetBoundsChange && typeof (toggleSubsetBoundsChange) === 'function') {
                        toggleSubsetBoundsChange(!subsetBoundsChange) //starts with false
                      }
                    }}
                  >Subset by map boundary</Checkbox>

                </Tab>
                {/* <Tab eventKey="3" title={
                  <i style={{ fontSize: '2rem' }}
                    className="fa fa-tasks" />
                }>
                  Tab 3
                </Tab> */}
                <Tab eventKey="3" title={
                  <i style={{ fontSize: '2rem' }}
                    className="fa fa-filter" />
                }>
                  {
                    data && data.length > 0 &&
                    <Variables
                      dark={dark}
                      multiVarSelect={multiVarSelect}
                      onSelectCallback={(mvs) => {
                        typeof (onSelectCallback) === 'function' &&
                          onSelectCallback(
                            Object.keys(mvs).length === 0 ?
                              { what: '' } : { what: 'multi', selected: mvs })
                        this.setState({ multiVarSelect: mvs })
                      }}
                      data={data} />
                  }
                </Tab>
              </Tabs>
            </div>
            <div className="space"></div>
            <form className="search-form" onSubmit={(e) => {
              e.preventDefault();
              // console.log(this.state.search);
              searchNominatom(this.state.search, (json) => {
                // console.log(json && json.length > 0 && json[0].boundingbox);
                let bbox = json && json.length > 0 && json[0].boundingbox;
                bbox = bbox && bbox.map(num => +(num))
                typeof onlocationChange === 'function' && bbox &&
                  onlocationChange({
                    bbox: bbox,
                    lon: +(json[0].lon), lat: +(json[0].lat)
                  })
              })
            }}>
              <FormGroup>
                <InputGroup>
                  <FormControl
                    style={{
                      background: dark ? '#242730' : 'white',
                      color: dark ? 'white' : 'black'
                    }}
                    onChange={(e) => this.setState({ search: e.target.value })}
                    placeholder="fly to..." type="text" />
                  <InputGroup.Addon
                    style={{
                      background: dark ? '#242730' : 'white',
                      color: dark ? 'white' : 'black'
                    }}>
                    <Glyphicon glyph="search" />
                  </InputGroup.Addon>
                </InputGroup>
              </FormGroup>
            </form>
          </div>
        </div>
      </>
    )
  }
}

