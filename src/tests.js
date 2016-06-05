'use strict';

require ('angular');
require ('angular-mocks');

var testsContext = require.context('.', true, /.spec$/);
testsContext.keys().forEach(testsContext);