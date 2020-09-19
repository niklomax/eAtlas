import React from 'react';
import { colorRangeNames} from '../utils';

export default function ColorPicker(props) {
  const { colourCallback } = props;
  const list = colorRangeNames.map((each, i) => {
    return (
      <div
        key={each}
        style={{
          backgroundColor: i === 0 ? 'red' :
            i === 1 ? 'blue' : i === 2 ? 'green' :
              i === 3 ? 'orange' : i === 4 ? 'brown' : 'yellow'
        }}
        className="color-box"
        onClick={() => {                  
          typeof colourCallback === 'function' &&
            colourCallback(each)
        }}/>
    )
  })
  console.log(list);
  return (
    <div className="color-picker-container">
      <p>Color range:</p>
      {
        list
      }
    </div>
  )
}