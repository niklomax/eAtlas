import React, { useState } from 'react';
import { Slider } from 'baseui/slider';
import { RadioGroup, Radio } from "baseui/radio";
import { Button } from 'baseui/button';

import MultiSelect from '../MultiSelect';

const Spenser = (props) => {
  const { saeyCallback } = props;
  const [year, setYear] = useState([2012])

  // accom,ownership,domestic,commsize,
  // occupants,rooms,bedrooms,perbedroom,
  // centralheating,nssec,ethnicity,cars,year

  const years = Array.from(Array(40), (_, i) => i + 2011);
  const fields = Object.keys(lookup);

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
          // value={{ id: lookup.age[age], value: age }}
          single={true}
          values={
            Object.keys(lookup[each]).map(e =>
              ({ id: lookup[each][e], value: e }))
          }
          // onSelectCallback={(selected) => {
          //   // array of seingle {id: , key: } object
          //   selected && setAge(selected[0].value)
          // }}
        />)
      }
      <Button onClick={() => {
        // const saey = sex + age + eth + year;
        // console.log(sex + age + eth + year);
        // typeof (saeyCallback) === 'function' &&
        //   saeyCallback(saey)
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
  "commsize": {
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

export default Spenser;