if(is.null(curl::nslookup("r-project.org", error = FALSE))) {
  stop(message(
    "No connection",
    "To save space on the repo files need to be downloaded.",
    "Please re-run when you are connected."
  ))
}
packages <- c("data.table", "curl")


if (length(setdiff(packages, rownames(installed.packages()))) > 0) {
  install.packages(setdiff(packages, rownames(installed.packages())),repos='http://cran.us.r-project.org')
}

lapply(packages, library, character.only = TRUE)

# Enable CORS -------------------------------------------------------------
#' CORS enabled for now. See docs of plumber
#' for disabling it for any endpoint we want in future
#' https://www.rplumber.io/docs/security.html#cross-origin-resource-sharing-cors
#' @filter cors
cors <- function(res) {
  res$setHeader("Access-Control-Allow-Origin", "*")
  plumber::forward()
}
# TODO: option to remove above CORS

#' @section TODO:
#' The plumber endpoint should not be there. Currently mapping React build to /
#' at assets causes the swagger endpoint to be 404. Support is limited.
#'
#' @get /__swagger__/
swagger <- function(req, res){
  fname <- system.file("swagger-ui/index.html", package = "plumber") # serve the swagger page.
  plumber::include_html(fname, res)
}

# https://github.com/layik/eAtlas/releases/
# download/0.0.1/pop-ages-range.Rds
pop.file <- "pop-final.Rds"
hh.file <- "hh-final.Rds"

github <- "https://github.com/layik/eAtlas/releases/download/0.0.1/"
check_download <- function(fname) {
  if(!file.exists(fname)) {
    download.file(
      paste0(github,
             fname),
      destfile = fname)
  } 
}
check_download(pop.file)
check_download(hh.file)

msoa.geojson <- "msoa.geojson"
check_download(msoa.geojson)

msoa.geojson <- readChar(msoa.geojson, file.info(msoa.geojson)$size)
#' serve the msoa.geojson
#' 
#' @get /api/msoa.geojson
get_msoa <- function(res) {
  res$headers$`Content-type` <- "application/json"
  res$body <- msoa.geojson
  res
}

p <- readRDS(pop.file)
h <- readRDS(hh.file)

if(!inherits(p$other, "numeric")) p = p[, other := as.numeric(other)]

#' serve spenser
#' saey in case of pop and everything in case of hh
#' 
#' @serializer unboxedJSON
#' @get /api/spenser
#' @get /api/spenser/<other>/<hh>
get_spenser <- function(other = "", hh = "") {
  m <- list(Error = "Error: please provide correct input values")
  # sanity checks
  if(length(other) > 50 | length(hh) > 5) {
    return(m)
  }
  # data.table column vs variable name
  o <- other
  if(nchar(hh) > 0) {
    # other patterm 1:2:3:4.. 
    message("households with other = ", o)
    res <- h[other== o, c("area","sum")]
  } else {
    if(is.null(o) | nchar(o) < 7) {
      return(m)
    }
    message("population with other = ", o)
    res <- p[other == as.numeric(o), c("area", "sum")]
  }
  # print("subset done...")
  # print(nrow(res))
  # if(nrow(res == 0)) {
  #   return(m)
  # }
  as.matrix(res)
}

#' Get every combination for an area. It takes an area code and
#' filters the entire population data and returns all combinations
#' of spenser data for the given area. It does not return area code.
#' 
#' r.data.table can do this fast!
#' 
#' @serializer unboxedJSON
#' @get /api/area
#' @get /api/area/<code>/<hh>
get_full_area <- function(code = "", hh = "") {
  m <- list(Error = "Error: please provide valid area code.")
  if(length(code) > 12 | length(hh) > 5) {
    return(m)
  }
  if(nchar(hh) > 0) {
    message("households with code = ", code)
    res <- h[area == code, c("other", "sum")]
  } else {
    if(is.null(code) | nchar(code) != 9) { # nchar("E02004899") == 9
      return(m)
    }
    message("population with code = ", code)
    res <- p[area == code, c("other", "sum")]
  }
  as.matrix(res)
}

#' https://www.rplumber.io/news/index.html#breaking-changes
#' plumber changes dir to this file's directory before processing.
#' 
#' Tell plumber where our public facing directory is to SERVE.
#' No need to map / to the build or public index.html. This will do.
#'
#' @assets ../build /
list()
