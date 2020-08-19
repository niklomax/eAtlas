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
  const eths = Object.keys(lookup.eth);

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
      {lookup.age[age]}
      <Slider
        min={ages[0]} max={ages[ages.length - 1]}
        value={age}
        onChange={({ value }) => {
          value && setAge(value);
          // console.log(value[0])
        }}
      />
      {lookup.eth[eth]}
      <Slider
        min={eths[0]} max={eths[eths.length - 1]}
        value={eth}
        onChange={({ value }) => {
          value && setEth(value);
          // console.log(value[0])
        }}
      />
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

const lookup = {
  "sex": {
    "0": "All persons",
    "1": "Males",
    "2": "Females"
  },
  "age": {
    "1": "Age 0 to 12",
    "2": "Age 13 to 18",
    "3": "Age 19 to 24",
    "4": "Age 25 to 34",
    "5": "Age 35 to 44",
    "6": "Age 45 to 54",
    "7": "Age 55 to 62",
    "8": "Age 63 to 74",
    "9": "Age 75+",
  },
  "eth": {
    "0": "All categories: Ethnic group",
    "1": "White: Total",
    "2": "White: English/Welsh/Scottish/Northern Irish/British",
    "3": "White: Irish",
    "4": "White: Gypsy or Irish Traveller",
    "5": "White: Other White",
    "6": "Mixed/multiple ethnic group: Total",
    "7": "Mixed/multiple ethnic group: White and Black Caribbean",
    "8": "Mixed/multiple ethnic group: White and Black African",
    "9": "Mixed/multiple ethnic group: White and Asian",
    "10": "Mixed/multiple ethnic group: Other Mixed",
    "11": "Asian/Asian British: Total",
    "12": "Asian/Asian British: Indian",
    "13": "Asian/Asian British: Pakistani",
    "14": "Asian/Asian British: Bangladeshi",
    "15": "Asian/Asian British: Chinese",
    "16": "Asian/Asian British: Other Asian",
    "17": "Black/African/Caribbean/Black British: Total",
    "18": "Black/African/Caribbean/Black British: African",
    "19": "Black/African/Caribbean/Black British: Caribbean",
    "20": "Black/African/Caribbean/Black British: Other Black",
    "21": "Other ethnic group: Total",
    "22": "Other ethnic group: Arab",
    "23": "Other ethnic group: Any other ethnic group"
  }
}

export default Spenser;