import { isArray } from "../../JSUtils";

const countryHistory = (data, by = "cases", min = 200, max=500, 
includeUSA = false) => {
  if(!data || data.length === 0) return null;
  
  const map = {}
  data.forEach(feature => {
    const location = feature.properties["countryterritoryCode"];
    const what = feature.properties[by];
    if (location !== null && feature.properties.dateRep) {
      if (isArray(map[location])) {
        map[location].push({x: feature.properties.dateRep, y: what})
      } else {
        map[location] = [{x: feature.properties.dateRep, y: what}]
      }
    }
  });
  //last 21 days
  const topx = {}
  Object.keys(map).forEach(country => {
    const l = map[country].length;    
    if((map[country][0].y > min && map[country][0].y < max) ||
    (includeUSA && country === "USA")) {
      topx[country] = map[country].reverse()
      .slice(l - 21 < 0 ? 0 : (l - 21), l - 1)
    }
  });
  // console.log(topx);
  
  return topx;
}

const breakdown = (data, by = "cases") => {
  if(!data || data.length === 0) return null;
  
  const map = {}
  data.forEach(feature => {
    const location = feature.properties["countryterritoryCode"];
    const cases = feature.properties[by];
    if (location !== null) {
      if (map[location]) {
        map[location] = map[location] + cases
      } else {
        map[location] = typeof cases === 'number' ? +(cases) : cases
      }
    }
  });
  return map;
}

const daysDiff = (s, e) => {
  const start = new Date(s);
  const end = new Date(e);  
  let diff = end.getTime() - start.getTime();
  diff = diff / (1000 * 3600 * 24);
  return diff;
}

export {
  countryHistory,
  breakdown,
  daysDiff
}