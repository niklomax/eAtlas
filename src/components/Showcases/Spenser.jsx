import React, { useState } from 'react';
import { Slider } from 'baseui/slider';
import { RadioGroup, Radio } from "baseui/radio";
import { Button } from 'baseui/button';

const Spenser = (props) => {
  const { saeyCallback } = props;
  const [year, setYear] = useState([2012])
  const [age, setAge] = useState([1])
  const [eth, setEth] = useState([2])
  const [sex, setSex] = useState("1")

  const years = Array.from(Array(40), (_, i) => i + 2011);
  const ages = Array.from(Array(9), (_, i) => i + 1);
  const eths = Array.from(Array(9), (_, i) => i + 1);

  return (
    <>
      <Slider
        min={years[0]} max={years[years.length - 1]}
        value={year}
        onChange={({ value }) => {
          value && setYear(value);
          // console.log(value[0])
        }}
      />
      Year
      <Slider
        min={ages[0]} max={ages[ages.length - 1]}
        value={age}
        onChange={({ value }) => {
          value && setAge(value);
          // console.log(value[0])
        }}
      />
      Age (codes for now)
      <Slider
        min={eths[0]} max={eths[eths.length - 1]}
        value={eth}
        onChange={({ value }) => {
          value && setEth(value);
          // console.log(value[0])
        }}
      />
      Ethnicity code (for now)
      <RadioGroup
        value={sex}
        onChange={e => {
          setSex(e.target.value)

        }}
        name="number"
        align={"horizontal"}
      >
        <Radio value="1">Female</Radio>
        <Radio value="2">Male</Radio>
      </RadioGroup>
      <Button onClick={() => {
        const saey = sex + age[0] + eth[0] + year;
        // console.log(sex + age[0] + eth[0] + year);
        typeof(saeyCallback) === 'function' &&
        saeyCallback(saey)
      }}>Update</Button>

    </>
  )
}

export default Spenser;