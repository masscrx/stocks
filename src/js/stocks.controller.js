'use strict';

angular.module('app')
.controller("StocksController", ["$scope", "dataFactory", 
  function($scope, dataFactory) {
  
  /* Datepicker */
  var currentDate, defaultEndDate;
  currentDate = defaultEndDate = new Date();
  var defaultStartDate = new Date(new Date().setMonth(new Date().getMonth()-6));

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
    var date = data.date,
        mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  /** Stocks operations **/
  $scope.tickers = ["CIK","MMM","ABT","ABBV","ACN","ADBE","ADT","AES","AET","AFL","AMG","A","APD","ARG","AKAM","AA","ALXN","ATI"];
  $scope.stocks = [];
  var stocksLimit = 3;

  $scope.addStock = function(stock) {
    // Check if stock is currently added for comparison
    for (var i = 0; i < $scope.stocks.length; i++) {
      if ($scope.stocks[i].key === stock) {
        window.alert("Stock currently added for comparison !");
        return;
      }
    }

    if ($scope.stocks.length < stocksLimit) {
      dataFactory.getStock({name: stock, startDate: $scope.startDate, endDate: $scope.endDate}).success(function(data, status){
        $scope.stocks.push(data);
        $scope.apiOverallChart.update();
      });
    }
    else {
      window.alert("Reached stocks limit (3) !");
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
      $scope.stocks.forEach(function(stock){
        loadedStocks.push(stock.key);
      });
    }
    dataFactory.refreshStocksData($scope.startDate, $scope.endDate, loadedStocks).success(function(data, status){
      $scope.stocks = data;
    });
  };

  /** Chart **/
  $scope.options = {};
  $scope.options.overallChart = {
    chart: {
      type: 'lineChart',
      height: 450,
      margin : {
        top: 0,
        right: 20,
        bottom: 60,
        left: 50
      },
      x: function(d){ return d.date; },
      y: function(d){ return d.close; },

      color: d3.scale.category10().range(),
      duration: 300,
      useInteractiveGuideline: true,
      clipVoronoi: false,

      xAxis: {
        axisLabel: 'Date',
        showMaxMin: false,
        tickFormat: function(d) {
          return d3.time.format("%Y-%m-%d")(new Date(d));
        }
      },

      yAxis: {
        axisLabel: 'Stock Price',
        showMaxMin: false,
        tickFormat: function(d){
          return '$' + d3.format(',.1f')(d);
        }
      }
    }
  };
}]);