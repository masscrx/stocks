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
        console.log("Adding to stocks array: ", data)
        $scope.stocks.push(data);
        console.log("Stocks array: ", $scope.stocks);
        $scope.apiOverallChart.update();
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

  /** Chart **/
  $scope.options = {};
  $scope.options.overallChart = {
    chart: {
      type: 'lineChart',
      height: 450,
      margin : {
          top: 20,
          right: 20,
          bottom: 40,
          left: 60
      },
      x: function(d){ return d.date; },
      y: function(d){ return d.close; },
      useInteractiveGuideline: true,
      duration: 100,
      xAxis: {
              axisLabel: 'Date',
              tickFormat: function(d) {
                  return d3.time.format("%Y-%m-%d")(new Date(d));
              },
              showMaxMin: false
              },

      yAxis: {
          axisLabel: 'Stock Price',
          tickFormat: function(d){
              return '$' + d3.format(',.1f')(d);
          },
          showMaxMin: false
      }
    }
  };
  $scope.exampleData = [
      {
        key: "Cisco", values: [
         { "date": 1469059200000, "close": 150.00 },
         { "date": 1469145600000, "close": 160.00 },
         { "date": 1469232000000, "close": 170.00 }
        ]
      },
      {
        key: "Ewa", values: [
         { "date": 1469059200000, "close": 5.00 },
         { "date": 1469145600000, "close": 10.00 },
         { "date": 1469232000000, "close": 20.00 }
        ]
      },

    ];

}]);