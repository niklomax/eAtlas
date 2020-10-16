function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

// geospenser.com
define("PRD_URL", 'http://geospenser.com');
define("DEV_URL", 'http://localhost:8000');
define("UI_LIST", [
  "checkbox",
  "radio",
  "buttongroups",
  "dropdown",
  "slider"]) 
define("LAYERSTYLES", [
  "arc",
  "geojson",
  "grid",
  "heatmap",
  "hex",
  "icon",
  "line",
  "path",
  "scatterplot",
  "sgrid",
  "barvis"
])     
