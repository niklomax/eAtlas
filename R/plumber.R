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
spenser.file <- "pop-ages-range.Rds"
github <- "https://github.com/layik/eAtlas/releases/download/0.0.1/"
if(!file.exists(spenser.file)) {
  download.file(
    paste0(github,
           spenser.file),
    destfile = spenser.file)
}

p <- readRDS(spenser.file)
names(p)[1:5] <- c("a", "s", "g", "e", "y")

#' serve spenser
#' @serializer unboxedJSON
#' @get /api/spenser
get_spenser <- function(sex=1, age=1, eth=1, year=2011) {
  print(area)
  m <- list(Error = "Error: please provide correct input values")
  if(is.null(sex) | is.null(age) | is.null(eth) | is.null(year)) {
    return(m)
  }
  res <- p[s==sex & g==age & e==eth & y == year]
  print("subset done...")
  print(nrow(res))
  if(nrow(res == 0)) {
    return(m)
  }
  res
}

#' Tell plumber where our public facing directory is to SERVE.
#' No need to map / to the build or public index.html. This will do.
#'
#' @assets ./build /
list()
