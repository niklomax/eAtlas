# get LAs
folder = "data"
if(!dir.exists(folder)) {
  dir.create(folder)
}
casesRds = "cases.Rds"
url = "https://www.arcgis.com/sharing/rest/content/items/b684319181f94875a6879bbc833ca3a6/data"
if(!file.exists(file.path(folder, casesRds))) {
  csv = read.csv(url)
  saveRDS(csv, file.path(folder, casesRds))
}
df = readRDS(file.path(folder, casesRds))
if(is.factor(df$TotalCases)) {
  df$TotalCases = as.numeric(as.character(df$TotalCases))
}
is.na(df$TotalCases) = 0
url = "https://github.com/layik/eAtlas/releases/download/0.0.1/LAs_centroids.Rds"
lasRds = "LAs_centroids.Rds"
if(!file.exists(file.path(folder, lasRds))) {
  download.file(url, destfile = file.path(folder, lasRds))
}
library(sf)
las = readRDS(file.path(folder, lasRds))
# las already centroids
m = match(tolower(df$GSS_NM), 
          tolower(las$ctyua17nm))
# nrow(df) - length(las) # 139
# nrow(df) # 150 names
# length(which(is.na(m)))
df = df[df$GSS_NM %in% las$ctyua17nm, ]
m = m[!is.na(m)]
stopifnot(!any(is.na(m)))
sfc = st_geometry(las[m,])
covid19 = st_as_sf(df, geom=sfc)
# top 30 regions
# plot(covid19[order(df$TotalCases, decreasing = T)[1:30],
              # "TotalCases"])
# plot(covid19)
# st_write(covid19, "covid19.geojson", update=TRUE)

regions_geojson = "regions.geojson"
url = "https://opendata.arcgis.com/datasets/01fd6b2d7600446d8af768005992f76a_4.geojson"
if(!file.exists(file.path(folder, regions_geojson))) {
  download.file(url, destfile = file.path(folder, regions_geojson))
}
r = st_read(file.path(folder, regions_geojson))
# r = st_transform(r, 4326)
w = st_within(covid19,r)
w = as.numeric(as.character(w))
w[is.na(w)] = 9
stopifnot(nrow(covid19) == length(w))
covid19$region = w
a = aggregate(TotalCases ~ region, covid19, sum)
r = r[a$region,]
r$TotalCases = a[,"TotalCases"]
covid19_regions = r[, c("nuts118cd", "nuts118nm", "TotalCases")]
# now geojson
names(covid19_regions) = c("code", "name", "TotalCases", "geometry")
names(covid19) = c("code", "name", "TotalCases", "geom", "region")
covid19 = geojsonsf::sf_geojson(covid19)
covid19_regions = geojsonsf::sf_geojson(covid19_regions)
# st_write(covid19_regions, 
#          "covid19-regions-date.geojson")

########### world ###########
# url changed 
# https://www.ecdc.europa.eu/en/publications-data/download-todays-data-geographic-distribution-covid-19-cases-worldwide
url = "https://opendata.ecdc.europa.eu/covid19/casedistribution/csv"
worldRds = "world.Rds"
if(!file.exists(file.path(folder, worldRds))) {
  csv = read.csv(url, stringsAsFactors = FALSE)
  saveRDS(csv, file.path(folder, worldRds))
}
csv = readRDS(file.path(folder, worldRds))
c = read.csv("countries.csv")
library(sf)
c = st_as_sf(c, coords = c("longitude","latitude"))
csv$countriesAndTerritories = gsub("[^A-Za-z]", "", 
                                   csv$countriesAndTerritories)
# underscores were removed.
csv$countriesAndTerritories = gsub("([a-z])([A-Z])", "\\1 \\2", 
                                   csv$countriesAndTerritories)
csv$countriesAndTerritories = gsub("United Statesof America", 
                                   "United States",
                                   csv$countriesAndTerritories)
csv = csv[tolower(csv$countriesAndTerritories) %in% 
            tolower(c$name), ]
m = unlist(lapply(tolower(csv$countriesAndTerritories), 
                  function(x) grep(x, tolower(c$name))[1]))
sfc = st_geometry(c)
m = m[!is.na(m)]
stopifnot(!any(is.na(m)))
sfc = sfc[m]
csv = st_as_sf(csv, geom = sfc)
covid19_world = geojsonsf::sf_geojson(csv)

#### UK daily
url = "https://www.arcgis.com/sharing/rest/content/items/e5fd11150d274bebaaf8fe2a7a2bda11/data"
daily = "daily.xlsx"
if(!file.exists(file.path(folder, daily))) {
  download.file(url, extra = '-L',
                destfile = file.path(folder, daily))}
daily = readxl::read_xlsx(file.path(folder, daily))
#### LA historical
url = "https://fingertips.phe.org.uk/documents/Historic%20COVID-19%20Dashboard%20Data.xlsx"
las_historical = "historyLAs.xlsx"
if(!file.exists(file.path(folder, las_historical))) {
  download.file(url, extra = '-L',
                destfile = file.path(folder, las_historical))
}
las_historical = readxl::read_xlsx(
  file.path(folder, las_historical), sheet = 6)
las_historical = las_historical[8:nrow(las_historical), ]
names(las_historical) = 
  c("code", "name", 
    unlist(lapply(1:(length(las_historical)-2), 
                  function(x)as.character(as.Date("2020-03-08")+x))))
