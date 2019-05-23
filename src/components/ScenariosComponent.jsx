/**
 * Add features from geojson from a URL to a given map.
 *
 *
 * If the features are points and there are >10 features or circle=true then
 * features are displayed as circleMarkers, else Markers.
 *
 * @param fetchURL default = 'http://localhost:8000/api/data'
 * @param radius default 8
 *
 * geoplumber R package React code.
 */
import React from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import { interpolatePlasma } from 'd3-scale-chromatic';

export default class ScenariosComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            geojson: null,
        }
        this._fetchData = this._fetchData.bind(this)
    }

    _fetchData(url, callback) {
        // console.log("fetching... " + url)
        fetch(url)
            .then((response) => {
                if (response.status !== 200) {
                    console.log('Looks like there was a problem. Status Code: ' +
                        response.status);
                    return;
                }
                // Examine the text in the response
                response.json()
                    .then((geojson) => {
                        if ((geojson.features && geojson.features.length === 0) || response.status === 'ZERO_RESULTS') {
                            this.setState({ error: response.status })
                        } else {
                            if (geojson.features) {
                                var geojsonLayer = L.geoJson(geojson)
                                const bbox = geojsonLayer.getBounds()
                                // assuming parent has provided "map" object
                                this.props.map && this.props.map.fitBounds(bbox)
                            }
                            callback(geojson)
                        }
                    });
            })
            .catch((err) => {
                console.log('Fetch Error: ', err);
            });
    }

    componentDidMount() {
        const geom = 'http://localhost:8000/api/geom'
        const json = 'http://localhost:8000/api/scenarios'
        this._fetchData(geom, (geojson) => this.setState({ geojson }))
        this._fetchData(json, (scenarios) => {
            const year1 = scenarios.filter(each => each.YEAR === 2020)
            var legend = L.control({ position: 'topright' });
            let jobsSum = 0
            year1.forEach((each) => jobsSum += parseFloat(each.JOBS))

            legend.onAdd = () => {
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = year1.map(each => each.JOBS).sort().slice(year1.length/2, year1.length),
                    labels = [];

                // loop through our density intervals and generate a label with a colored square for each interval
                for (var i = 0; i < grades.length; i++) {
                    div.innerHTML +=
                        '<i style="background:' + interpolatePlasma(10 * grades[i]/jobsSum) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '<br>' : '+');
                }
                return div;
            };

            legend.addTo(this.props.map);
            this.setState({ scenarios: year1, jobsSum })
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.fetchURL !== prevProps.fetchURL) {
            this._fetchData()
        }
        if (this.props.radius !== prevProps.radius) {
            this.forceUpdate()
        }
    }

    render() {
        const { geojson, scenarios } = this.state;
        let { style } = this.props;
        if (!geojson || !scenarios) {
            return (null) // as per React docs
        }

        if (!geojson.features || geojson.type !== "FeatureCollection") {
            if (geojson.coordinates) { //single feature.
                return (
                    <GeoJSON //react-leaflet component
                        style={style}
                        data={geojson}
                    />
                )
            } else {
                return (null) //nothing is passed to me.
            }
        }
        // we have type: "FeatureCollection"
        return (
            geojson.features.map((feature, i) => {
                const record = scenarios.filter(each => each.CODE === feature.properties['LAD13CD'])
                return (
                    <GeoJSON //react-leaflet component
                        key={feature.properties['LAD13CD']}
                        style={{
                            fillColor: interpolatePlasma(10 * record[0].JOBS / this.state.jobsSum),
                            weight: 5 + record[0].HOUSEHOLDS,
                            opacity: 1,
                            color: 'white',
                            dashArray: '3',
                            fillOpacity: 0.7
                        }}
                        data={feature}
                        onEachFeature={(feature, layer) => {
                            const record = scenarios.filter(each => each.CODE === feature.properties['LAD13CD'])
                            const properties = Object.keys(record[0]).map((key) => {
                                return (key + " : " + record[0][key])
                            })
                            layer.bindPopup(
                                properties.join('<br/>')
                            );
                        }}
                        pointToLayer={
                            // use cricles prop if not 10 markers is enough
                            this.props.circle || geojson.features.length > 8 ?
                                (_, latlng) => {
                                    // Change the values of these options to change the symbol's appearance
                                    let options = {
                                        radius: record[0].GVA / 10,
                                        fillColor: "green",
                                        color: "black",
                                        weight: 1,
                                        opacity: 1,
                                        fillOpacity: 0.8
                                    }
                                    return L.circleMarker(latlng, options);
                                }
                                :
                                (_, latlng) => {
                                    return L.marker(latlng);
                                }
                        }
                    />
                )
            })
        )
    }
}
