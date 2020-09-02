
# eAtlas · [![Build Status](https://travis-ci.org/layik/eAtlas.svg)](https://travis-ci.org/layik/eAtlas) [![Project Status: WIP](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip) [![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](#)

#### This README is for branch `spenser`

The `eAtlas` project itself has a different README. The rest of the
document, outlining development and deployment of the app is the same.

### Development

The front end is an npm package, so if you do not need the backend,
having cloned the repo:

``` js
npm i # or yarn
# and run
npm start
```

The frontend is a
[`create-react-app`](https://create-react-app.dev/docs/getting-started/)
(CRA) so all the standard commands of CRA appliees.

### R

The whole application is a
[geopumber](https://github.com/ATFutures/geoplumber) app. That means it
is an R powered backend API (think Flask in Python) and a ReactJS front
end.

To build the frontend, from an R console:

``` r
library(geoplumber)
gp_build()
```

Before you run the app:

  - you will need some preprocessed data, an RDS called
    “ac\_joined\_wy\_2009-2017.Rds”.

  - you will need a Mapbox API key (will see if we can remove this) in
    `.env.local` file using variable name:
    `REACT_APP_MAPBOX_ACCESS_TOKEN = 'API_KEY'`

  - in production its better to change the `PRD_URL` in the
    `Constants.js` file.

Then you can run

``` r
library(geoplumber)
gp_plumb()
```

visit `localhost:8000`

or just run the front using (without any data loaded from local server):
`npm i & npm start`

### Docker for production

Repo contains Dockerfile for production. This is again WIP.

``` sh
# Dockerfile manages your npm/React build steps
# REACT_APP_MAPBOX_ACCESS_TOKEN is required but app should run
docker build -t eatlas .
# then bind plumber's default 8000 port to any of your choice
docker run -d -p 8000:8001 --name eatlas eatlas
```

Use your favourite document server (nginx for example) to proxy requets
(more later hopefully).

### Screenshots/gif’s

<img width="100%" alt="eAtlas screen shot" src="https://user-images.githubusercontent.com/408568/76419738-c46edc80-6398-11ea-8bbe-496394f90adc.png">
