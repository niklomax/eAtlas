import React from 'react';
import MultiSelect from './MultiSelect';

export default class MapboxBaseLayers extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            bases: [
                'dark',
                'basic',
                'streets',
                'bright',
                'light',
                'satellite',
                'No map'
            ],
            selected: 'dark'
        }
    }

    render() { 
        const {selected, bases} = this.state;
        const {onSelectCallback} = this.props;
        // console.log(selected);
        
        return(
          <MultiSelect
            title={selected === 'dark' ? "Default(dark)" : selected}
            single={true}
            values={
              bases.map(e => ({ id: e, value: e }))
            }
            onSelectCallback={(selected) => {
              this.setState({ selected });
              typeof (onSelectCallback) === 'function' &&
                onSelectCallback(selected[0].value)
            }}
          />
        )
    }
}