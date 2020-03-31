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

export {
  breakdown
}