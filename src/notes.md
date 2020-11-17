## Project
High resolution geographical and sub-population projections are essential for the planning and delivery of services and urban infrastructure developments. SPENSER (a synthetic population estimation and projection model) uses dynamic microsimulation to produce projections under different, user defined scenarios. SPENSER will make high resolution demographic forecasting accessible to stakeholders across a range of application areas, from physical infrastructure planning to health and social care spending, enabling users to run 'what if' scenarios and facilitating evidence based planning decisions.

For the full description fo the project please see the [project page](https://www.turing.ac.uk/research/research-projects/synthetic-population-estimation-and-scenario-projection) on Alan Turing Instiute website.

### Data output and processing
There are two sets of datasets within SPENSER output: population and households. The output data is saved in CSV files with a name that contains geography and time like: ssm_E08000022_MSOA11_ppp_2050.csv. The content of this file (which is a population data sample) using a `head` Unix command is:

```
PID,Area,Sex,Age,Ethnicity
0,E02001738,1,1,2
1,E02001738,1,1,2
2,E02001738,1,1,2
3,E02001738,1,1,2
4,E02001738,1,1,2
5,E02001738,1,1,2
6,E02001738,1,1,2
7,E02001738,1,1,2
8,E02001738,1,1,2
```

Combining 12,928 population data files resulted in 675,447,329 rows of data like above. Processing the files could not be done on 16GB machines.

Processing this amount of data is challenging and was achieved using latest packages in R (data table which is written in C). There is a longer technical blogpost for those interested [here](https://layik.github.io/spenser).

### Vis
While the population data is composed of five fields (Area, Sex,Age, Ethnicity and Year), the household data is composed of 15 fields with the same spatial distribution (output area geography). The fields including "Year" are:

```
 [1] "Area"                    "LC4402_C_TYPACCOM"      
 [3] "QS420_CELL"              "LC4402_C_TENHUK11"      
 [5] "LC4408_C_AHTHUK11"       "CommunalSize"           
 [7] "LC4404_C_SIZHUK11"       "LC4404_C_ROOMS"         
 [9] "LC4405EW_C_BEDROOMS"     "LC4408EW_C_PPBROOMHEW11"
[11] "LC4402_C_CENHEATHUK11"   "LC4605_C_NSSEC"         
[13] "LC4202_C_ETHHUK11"       "LC4202_C_CARSNO"        
[15] "Year"
```

Before visualizing the households data, it was scaled down to MSOA level (Middle Super Output Areas) geography. This makes it possible to query the data easier and visualize using Turing Geovisualization Engine (TGVE). 

The visualization of the population data is further encoded to enable searching through all fields (Age, Sex, Ethnicity and year). The housholds data is simply number of households per area per year.

The "table" icon in the sidebar of the user interface always shows current data pulled from the server. The "update" button is there to limit querying the server and better user experience. 