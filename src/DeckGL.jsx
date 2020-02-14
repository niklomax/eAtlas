
import React from 'react';
import DeckGL from 'deck.gl';
import MapGL, { NavigationControl } from 'react-map-gl';

import Constants from './Constants';
import {
  fetchData, getParamsFromSearch, getBbx,
} from './utils';
import history from './history';

const URL = (process.env.NODE_ENV === 'development' ? Constants.DEV_URL : Constants.PRD_URL);

export default class DeckGLMap extends React.Component {
  constructor(props) {
    super(props)
    const init = {
      longitude: -1.6362,
      latitude: 53.8321,
      zoom: 10,
      pitch: 55,
      bearing: 0,
    }
    const param = getParamsFromSearch(props.location.search);
    if (param) {
      //lat=53.814&lng=-1.534&zoom=11.05&bea=0&pit=55&alt=1.5
      Object.keys(param).forEach(key => {
        Object.keys(init).forEach(iKey => {
          if (iKey.startsWith(key)) {
            init[key] = param[key]
          }
        })
      })
    }

    this.state = {
      initialViewState: init,
      subsetBoundsChange: false,
      lastViewPortChange: new Date(),
      iconLimit: 500,
    }
    // this._fitViewport = this._fitViewport.bind(this);
  }

  _updateURL(viewport) {
    const { latitude, longitude, zoom, bearing, pitch, altitude } = viewport;
    const { subsetBoundsChange, lastViewPortChange } = this.state;

    //if we do history.replace/push 100 times in less than 30 secs 
    // browser will crash
    if (new Date() - lastViewPortChange > 1000) {
      history.push(
        `/?lat=${latitude.toFixed(3)}` +
        `&lng=${longitude.toFixed(3)}` +
        `&zoom=${zoom.toFixed(2)}` +
        `&bea=${bearing}` +
        `&pit=${pitch}` +
        `&alt=${altitude}`
      )
      this.setState({ lastViewPortChange: new Date() })
    }
    const bounds = this.map && this.map.getBounds()
    if (bounds && subsetBoundsChange) {
      const box = getBbx(bounds)
      // console.log("bounds", box);
      const { xmin, ymin, xmax, ymax } = box;
      fetchData(URL + "/api/stats19/" + xmin + "/" +
        ymin + "/" + xmax + "/" + ymax,
        (data, error) => {
          if (!error) {
            // console.log(data.features);
            this.setState({
              data: data.features,
            })
            this._generateLayer()
          } else {
            //network error?
          }
        })
    }

  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (JSON.stringify(nextState.viewport) !==
  //     JSON.stringify(this.state.viewport)) {
  //     return true;
  //   }
  //   if (nextProps.data && this.props.data &&
  //     this.props.data.length === nextProps.data.length) {
  //     return false;
  //   }
  //   return true;
  // }

  render() {
    const { viewport, initialViewState } = this.state;
    const { mapCallback, mapStyle } = this.props;
    return (
      <MapGL
        key="mainmap"
        ref={ref => {
          // save a reference to the mapboxgl.Map instance
          this.map = ref && ref.getMap();
          typeof (mapCallback) === 'function' &&
            mapCallback(this.map)
        }}
        mapStyle={mapStyle}
        onViewportChange={(viewport) => {
          this._updateURL(viewport)
          this.setState({ viewport })
        }}
        height={window.innerHeight - 54 + 'px'}
        width={window.innerWidth + 'px'}
        //crucial bit below
        viewState={viewport ? viewport : initialViewState}
      // mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
      >
        <div className='mapboxgl-ctrl-top-right' style={{
          zIndex: 9
        }}>
          <NavigationControl
            {...viewport}
            onViewportChange={viewport => this.setState({ viewport })}
          />
        </div>
        <DeckGL
          viewState={viewport ? viewport : initialViewState}
          initialViewState={initialViewState}
          layers={this.props.layers}
        />
      </MapGL>
    )
  }
}

