import React, { useState } from 'react';
import { Slider } from 'baseui/slider';
import { Button } from 'baseui/button';

import MultiSelect from '../MultiSelect';

const columns = ['accomodation', 'ownership', 'domestic', 'commsize',
  'occupants', 'rooms', 'bedrooms', 'perbedroom',
  'centralheating', 'nssec', 'ethnicity', 'cars', 'year'];

const parseColumns = (str) => {
  if (!str || typeof (str) !== 'string' ||
    str.split(":").length !== columns.length) return
  const split = str.split(":");
  return columns.reduce((previous, current, i) => {
    if (typeof (previous) === 'string') { //first value
      return ({
        [previous]: split[i - 1],
        [current]: split[i]
      })
    } else {
      return ({
        ...previous,
        [current]: split[i]
      })
    }
  })
}

const assembleColumns = (obj) => {
  if (!obj || typeof (obj) !== 'object' ||
    Object.keys(obj).length !== columns.length) return
  return columns.reduce((previous, current, i) => {
    if (i === 1) {
      return obj[previous] + ":" + obj[current]
    } else {
      return (previous + ":" + obj[current])
    }
  })
}

const HouseholdUI = (props) => {
  const { saeyCallback } = props;
  const [year, setYear] = useState([2012]);
  const [values, setValues] = useState(
    parseColumns('3:2:3:-2:4:6:3:-1:2:6:2:2:' + year)
  ); // household fields' values

  const years = Array.from(Array(40), (_, i) => i + 2011);
  const fields = Object.keys(lookup);

  // const t = '1:2:3:4:5:6:7:8:9:10:11:12:13'
  // const p = parseColumns(t)
  // const a = assembleColumns(parseColumns(t))
  // console.log(a === t)

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
      {
        fields.map(each => <MultiSelect
          title={each}
          value={{ id: lookup[each][values[each]], value: values[each] }}
          single={true}
          values={
            Object.keys(lookup[each]).map(e =>
              ({ id: lookup[each][e], value: e }))
          }
          onSelectCallback={(selected) => {
            // array of seingle {id: , key: } object
            setValues(Object.assign(values, { [each]: selected[0].value }))
            console.log(values);
            // selected && setAge(selected[0].value)
          }}
        />)
      }
      <Button onClick={() => {
        // assemble
        const o = assembleColumns({
          // comsize summary from R
          // summary(d$CommunalSize)
          // Min.  1st Qu.   Median     Mean  3rd Qu.     Max. 
          // -2.000   -2.000   -2.000   -1.962   -2.000 1654.000 
          ...values, year: year, commsize: -2
        })
        console.log(o);
        typeof (saeyCallback) === 'function' &&
          saeyCallback(o, true)
      }}
      >Update</Button>

    </>
  )
}

const lookup = {
  "accomodation": {
    "0": "All categories: Accommodation type",
    "1": "Whole house or bungalow: Total",
    "2": "Whole house or bungalow: Detached",
    "3": "Whole house or bungalow: Semi-detached",
    "4": "Whole house or bungalow: Terraced (including end-terrace)",
    "5": "Flat, maisonette or apartment, or mobile/temporary accommodation"
  },
  "ownership": {
    "0": "All categories: Tenure",
    "1": "Owned or shared ownership: Total",
    "2": "Owned: Owned outright",
    "3": "Owned: Owned with a mortgage or loan or shared ownership",
    "4": "Rented or living rent free: Total",
    "5": "Rented: Social rented",
    "6": "Rented: Private rented or living rent free"
  },
  "domestic": {
    "0": "All categories: Household type",
    "1": "One person household",
    "2": "Married or same-sex civil partnership couple household",
    "3": "Cohabiting couple household",
    "4": "Lone parent household",
    "5": "Multi-person household"
  },
  "occupants": {
    "0": "All categories: Household size",
    "1": "1 person in household",
    "2": "2 people in household",
    "3": "3 people in household",
    "4": "4 or more people in household"
  },
  "bedrooms": {
    "0": "All categories: Number of bedrooms",
    "1": "1 bedroom",
    "2": "2 bedrooms",
    "3": "3 bedrooms",
    "4": "4 or more bedrooms"
  },
  "rooms": {
    "0": "All categories: Number of rooms",
    "1": "1 room",
    "2": "2 rooms",
    "3": "3 rooms",
    "4": "4 rooms",
    "5": "5 rooms",
    "6": "6 or more rooms"
  },
  "perbedroom": {
    "0": "All categories: Number of persons per bedroom in household",
    "1": "Up to 0.5 persons per bedroom",
    "2": "Over 0.5 and up to 1.0 persons per bedroom",
    "3": "Over 1.0 and up to 1.5 persons per bedroom",
    "4": "Over 1.5 persons per bedroom"
  },
  "centralheating": {
    "0": "All categories: Type of central heating in household",
    "1": "Does not have central heating",
    "2": "Does have central heating"
  },
  "nssec": {
    "0": "All categories: NS-SeC",
    "1": "1. Higher managerial, administrative and professional occupations",
    "2": "2. Lower managerial, administrative and professional occupations",
    "3": "3. Intermediate occupations",
    "4": "4. Small employers and own account workers",
    "5": "5. Lower supervisory and technical occupations",
    "6": "6. Semi-routine occupations",
    "7": "7. Routine occupations",
    "8": "8. Never worked and long-term unemployed",
    "9": "L15 Full-time students"
  },
  "ethnicity": {
    "0": "All categories: Ethnic group of HRP",
    "1": "White: Total",
    "2": "White: English/Welsh/Scottish/Northern Irish/British",
    "3": "White: Irish",
    "4": "White: Other White",
    "5": "Mixed/multiple ethnic group",
    "6": "Asian/Asian British",
    "7": "Black/African/Caribbean/Black British",
    "8": "Other ethnic group"
  },
  "cars": {
    "0": "All categories: Car or van availability",
    "1": "No cars or vans in household",
    "2": "1 car or van in household",
    "3": "2 or more cars or vans in household"
  }
}

export default HouseholdUI;