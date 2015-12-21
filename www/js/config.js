'use strict';

var appConfig = angular.module('myApp.config', []);
/*
 * Test server : http://localhost:8000/
 * Test Auth : http://localhost:8000/pusher/auth
 * Live server : http://api-baghchal-app.herokuapp.com/
 * Live Auth: http://api-baghchal-app.herokuapp.com/pusher/auth
 */
appConfig.constant('myConfig', {
  'auth': 'http://api-baghchal-app.herokuapp.com/pusher/auth',
  'server': 'http://api-baghchal-app.herokuapp.com/',
  'pusher': 'ab3bc8f6a7e5c78a9026'
});