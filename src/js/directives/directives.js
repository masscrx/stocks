'use strict';

var ChartDirective = require('./chart/chart.directive');

angular.module('app.directives', [])
.directive('lineChart', ChartDirective);
