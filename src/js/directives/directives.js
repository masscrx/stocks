'use strict';

var ChartDirective = require('./chart/chart.directive');
var ManageButtonDirective = require('./manage-button/manage-button.directive');

angular.module('app.directives', [])
.directive('lineChart', ChartDirective)
.directive('manageButton', ManageButtonDirective);
