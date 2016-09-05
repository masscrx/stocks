'use strict';

app.controller("StocksController", ["$scope", "dataFactory", function($scope, dataFactory) {
  
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
    if ($scope.stocks.length < stocksLimit) {
      dataFactory.getStock({name: stock, startDate: $scope.startDate, endDate: $scope.endDate}).success(function(data, status){
        var objAdded = {
          symbol: data["query"]["results"]["quote"][0]["Symbol"],
          quotes: data["query"]["results"]["quote"]
        };
        $scope.stocks.push(objAdded);
        console.log($scope.stocks);
      });
    }
    else {
      window.alert("Reached stocks limit (3) !");
    }
    
  };

  $scope.delStock = function(stock) {
    
    for (var i = 0; i < $scope.stocks.length; i++) {
      if ($scope.stocks[i].symbol === stock) {
        $scope.stocks.splice(i, 1);
      }
    }

    console.log($scope.stocks);
  };
}]);