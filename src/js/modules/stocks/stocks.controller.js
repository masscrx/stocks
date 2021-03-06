'use strict';

module.exports = ['$scope', 'dataFactory', function($scope, dataFactory) {

  /* Datepicker */
  var currentDate;
  var defaultEndDate;
  currentDate = defaultEndDate = new Date();
  var defaultStartDate = new Date(new Date().setMonth(new Date().getMonth() - 6));

  $scope.startDate = defaultStartDate;
  $scope.endDate = defaultEndDate;

  $scope.dateOptions = {
    dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(),
    startingDay: 1
  };

  $scope.popup1 = {
    opened: false
  };

  $scope.popup2 = {
    opened: false
  };

  $scope.open1 = function() {
    $scope.popup1.opened = true;
  };

  $scope.open2 = function() {
    $scope.popup2.opened = true;
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date;
    var mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  /** Stocks operations **/
  $scope.tickers = ['CIK', 'MMM', 'ABT', 'ABBV', 'ACN', 'ADBE', 'AES',
                    'AET', 'AFL', 'AMG', 'A', 'APD', 'ARG', 'AKAM', 'AA', 'ALXN', 'ATI'];
  $scope.stocks = [];
  var stocksLimit = 3;

  $scope.stockInComparison = function(name) {
    var inComparison = false;
    for (var i = 0; i < $scope.stocks.length; i++) {
      if ($scope.stocks[i].key === name) {
        inComparison = true;
      }
    }

    return inComparison;
  };

  $scope.addStock = function(stock) {
    // Check if stock is currently added for comparison
    if ($scope.stockInComparison(stock)) {
      window.alert('Stock currently added for comparison !');
      return;
    }

    if ($scope.stocks.length < stocksLimit) {
      dataFactory
        .getStock({ name: stock, startDate: $scope.startDate, endDate: $scope.endDate })
        .then(function(res, status) {
          $scope.stocks.push(res.data);
        });
    } else {
      window.alert('Reached stocks limit ' + stocksLimit + ' !');
    }
  };

  $scope.delStock = function(stock) {
    for (var i = 0; i < $scope.stocks.length; i++) {
      if ($scope.stocks[i].key === stock) {
        $scope.stocks.splice(i, 1);
      }
    }
  };

  $scope.reloadStocksData = function() {
    var loadedStocks = [];
    if ($scope.stocks.length > 0) {
      $scope.stocks.forEach(function(stock) {
        loadedStocks.push(stock.key);
      });

      dataFactory
        .refreshStocksData($scope.startDate, $scope.endDate, loadedStocks)
        .then(function(res, status) {
          $scope.stocks = res.data;
        });
    }
  };
}];
