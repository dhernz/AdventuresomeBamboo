var request = require('request'); // Request JS for simple API calls
var async = require('async') // Async JS for handling async operations
var currentYear = new Date().getFullYear(); //Dynamically set current year

/*********************** Functions ****************************/

module.exports.getCropNames = function (state, cropType){
  var year = year || 2014;
  var crops = {}; // <-- holder for the crop names that will be passed in
  var data = ''; // <-- data hold for parsing
  link = 'http://nass-api.azurewebsites.net/api/api_get?source_desc=SURVEY&sector_desc=CROPS&group_desc='+cropType+'&agg_level_desc=STATE&state_name='+state+'&year='+year+'&statisticcat_desc=PRODUCTION&class_desc=ALL%20CLASSES&domain_desc=TOTAL&freq_desc=ANNUAL&util_practice_desc=ALL%20UTILIZATION%20PRACTICES&unit_desc=CWT';
  // ^-- Above is the link for the API request check the vars in the string...
  async-series([ //<-- handling of asynchronous calls
    function(cb){
      request.get(link) // <-- initiates connection to API server
      .on('data', function(chunk){ // <-- listens for data
        data += chunk;             // <-- then collects it
      })
      .on('end', function(){                // <-- once data is done sending
        parseData(data).forEach(function(info){ // Parse it
          crops[info.util_practice_desc] = info.commodity_desc; //add the names to the crops object
        })
      })
      cb();
    },
    function(cb){
      cb();
      return crops; //return it
    }
  ])
}

module.exports.showCropInfo = function (state, cropType, crop, year){
  var year = year || 2012;
  var production = {}; // <-- holder for the production values that will be passed in
  var data = ''; // <-- data hold for parsing
  link = 'http://nass-api.azurewebsites.net/api/api_get?source_desc=SURVEY&sector_desc=CROPS&group_desc='+cropType+'&agg_level_desc=STATE&year='+year+'&state_name='+state+'&commodity_desc='+crop;
  // ^-- Above is the link for the API request check the vars in the string...
  async-series([//<-- handling of asynchronous calls
    function(cb){
      request.get(link)// <-- initiates connection to API server
      .on('data', function(chunk){ // <-- listens for data
        data += chunk;              // <-- then collects it
      })
      .on('end', function(){        // <-- once data is done sending
        production[year] = [];
        parseData(data).forEach(function(info){ 
        production[year].push(info.value);
        });
      })
      cb();
    },
    function  (cb){
      cb();
      return dataReturn(production)
    }
  ])
};

 var parseData = function (data){
  return JSON.parse(data).data;
};