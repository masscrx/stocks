'use strict';

require('./services/services');
require('./modules/modules');
require('./directives/directives');

angular.module('app', [
  'ui.bootstrap',
  'app.modules',
  'app.services',
  'app.directives'
]);
