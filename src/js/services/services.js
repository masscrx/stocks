'use strict';

var DataService = require('./data.service');

angular.module('app.services', [])
.factory('dataFactory', DataService);
