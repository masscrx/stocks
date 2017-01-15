module.exports = ['$http', function($http) {
  function formatDate(date) {
    return date.toISOString().substring(0, 10);
  }

  function getStockIndex(value, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].key === value) {
        return i;
      }
    }
  }

  function formatStockValues(obj) {
    var formattedObj = {
      date: obj.Date,
      open: Number.parseFloat(obj.Open),
      high: Number.parseFloat(obj.High),
      low: Number.parseFloat(obj.Low),
      close: Number.parseFloat(obj.Close),
      volume: Number.parseFloat(obj.Volume),
      adj_close: Number.parseFloat(obj.Adj_Close)
    };
    return formattedObj;
  }

  return {
    getStock: function(stock) {
      /** Convert date to format expected by yahoo API **/
      var _startDate = formatDate(stock.startDate);
      var _endDate = formatDate(stock.endDate);

      return $http({
        method: 'GET',
        url: 'http://query.yahooapis.com/v1/public/yql',
        params: {
          q: 'select * from yahoo.finance.historicaldata ' +
              'where symbol in ' + '(\'' + stock.name + '\') ' +
              'and startDate = \'' + _startDate + '\' and endDate = \'' +
              _endDate + '\'',
          env: 'http://datatables.org/alltables.env',
          format: 'json'
        },
        transformResponse: function(data) {
          var _data = JSON.parse(data);

          var formattedObj = {
            key: _data.query.results.quote[0].Symbol,
            values: []
          };
          var stockData = _data.query.results.quote;

          angular.forEach(stockData, function(obj, index) {
            formattedObj.values.push(formatStockValues(obj));
          });

          return formattedObj;
        }
      });
    },

    refreshStocksData: function(startDate, endDate, stocks) {
      var _startDate = formatDate(startDate);
      var _endDate = formatDate(endDate);
      var stocksQueryString = '';

      for (var i = 0; i < stocks.length; i++)
      {
        stocksQueryString += "'" + stocks[i] + "',";
      }

      // remove last character (comma) from string
      stocksQueryString = stocksQueryString.slice(0, -1);

      return $http({
        method: 'GET',
        url: 'http://query.yahooapis.com/v1/public/yql',
        params: {
          q: 'select * from yahoo.finance.historicaldata ' +
             'where symbol in ' + '(' + stocksQueryString + ') ' +
             'and startDate = \'' + _startDate + '\' and endDate = \'' + _endDate + '\'',
          env: 'http://datatables.org/alltables.env',
          format: 'json'
        },
        transformResponse: function(data) {
          var formattedStocksArray = [];
          var _data = JSON.parse(data); // string
          var stocksData = _data.query.results.quote; // array

          // prepare array
          for (var i = 0; i < stocks.length; i++) {
            formattedStocksArray.push({ key: stocks[i], values: [] });
          }

          for (var ii = 0; ii < stocksData.length; ii++) {
            var index = getStockIndex(stocksData[ii].Symbol, formattedStocksArray);
            formattedStocksArray[index].values.push(formatStockValues(stocksData[ii]));
          }

          return formattedStocksArray;
        }
      });
    }
  };
}];
