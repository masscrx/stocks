'use strict';

app.controller("StocksController", ["$scope", function($scope) {

  /* Datepicker */
  var currentDate = new Date();
  $scope.startDate = currentDate.setMonth(currentDate.getMonth()-6);
  $scope.endDate = new Date();

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

  $scope.tickers = ["GICS","CIK","MMM","ABT","ABBV","ACN","ACE","ACT","ADBE","ADT","AES","AET","AFL","AMG","A","GAS","APD","ARG","AKAM","AA","ALXN","ATI","ALLE","ADS","ALL","ALTR","MO","AMZN","AEE","AAL"]



}]);