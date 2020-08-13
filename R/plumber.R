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
spenser.file <- "pop-final.Rds"
github <- "https://github.com/layik/eAtlas/releases/download/0.0.1/"
if(!file.exists(spenser.file)) {
  download.file(
    paste0(github,
           spenser.file),
    destfile = spenser.file)
}

p <- readRDS(spenser.file)
library(data.table)

#' serve spenser
#' @serializer unboxedJSON
#' @get /api/spenser
#' @get /api/spenser/<saey>
get_spenser <- function(saey) {
  m <- list(Error = "Error: please provide correct input values")
  if(is.null(saey) | nchar(saey) < 7) {
    return(m)
  }
  res <- p[other==saey, c("area","sum")]
  print("subset done...")
  print(nrow(res))
  # if(nrow(res == 0)) {
  #   return(m)
  # }
  as.matrix(res)
}

#' Tell plumber where our public facing directory is to SERVE.
#' No need to map / to the build or public index.html. This will do.
#'
#' @assets ./public /
list()
