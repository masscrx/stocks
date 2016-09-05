"use strict";

app.factory("dataFactory", ["$http", function($http){
  return {
    getStock: function(stock) {
      console.log(stock)
      /** Convert date to format expected by yahoo API **/
      var _startDate = stock.startDate.toISOString().substring(0, 10);
      var _endDate = stock.endDate.toISOString().substring(0, 10);
      
      return $http({
        method: "GET",
        url: "http://query.yahooapis.com/v1/public/yql",
        params: {
          q: "select * from yahoo.finance.historicaldata " + "where symbol in " + "('" + stock.name + "') " + "and startDate = '" + _startDate + "' and endDate = '" + _endDate + "'",
          env: "http://datatables.org/alltables.env",
          format: "json"
        },
        transformResponse: function(data) {
          var data = JSON.parse(data);
          
          var formattedObj = {
            key: data["query"]["results"]["quote"][0].Symbol,
            values: []
          };

          angular.forEach(data["query"]["results"]["quote"], function(obj, index){
          formattedObj.values.push({
            date: new Date(obj.Date).getTime(),
            open: Number.parseFloat(obj.Open),
            high: Number.parseFloat(obj.High),
            low: Number.parseFloat(obj.Low),
            close: Number.parseFloat(obj.Close),
            volume: Number.parseFloat(obj.Volume),
            adj_close: Number.parseFloat(obj.Adj_Close)
          })
        })
          return formattedObj;
        }
      });
    }
  };
}]);