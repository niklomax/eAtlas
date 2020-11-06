import React, { useState } from 'react';
import { Slider } from 'baseui/slider';
import { Button } from 'baseui/button';

const HouseholdUI = (props) => {
  const { saeyCallback } = props;
  const [year, setYear] = useState([2012]);
  const years = Array.from(Array(30), (_, i) => i + 2011);

  return (
    <>
      Year ({year})
      <Slider
        min={years[0]} max={years[years.length - 1]}
        value={year}
        onChange={({ value }) => {
          value && setYear(value);
          // console.log(value[0])
        }}
      />
      
      <Button onClick={() => {
        // assemble
        typeof (saeyCallback) === 'function' &&
          saeyCallback(year, true)
      }}
      >Update</Button>

    </>
  )
}

export default HouseholdUI;