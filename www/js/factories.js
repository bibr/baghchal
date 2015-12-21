'use strict';

var pusherFactories = angular.module('pusherFactories', ['ngResource', 'myApp.config']);

pusherFactories.factory('Challenge', ['$resource', 'myConfig',
    function($resource, myConfig) {
        return $resource(myConfig.server+'game/challenged', {}, {
            query: {method: 'GET', isArray: false}
        });
    }]);

pusherFactories.factory('StartGame', ['$resource', 'myConfig',
    function($resource, myConfig) {
        return $resource(myConfig.server+'game/start', {}, {
            query: {method: 'GET', isArray: false}
        });
    }]);

pusherFactories.factory('CheckGame', ['$resource', 'myConfig',
    function($resource, myConfig) {
        return $resource(myConfig.server+'game/check', {}, {
            query: {method: 'GET', isArray: false}
        });
    }]);


pusherFactories.factory('Move', ['$resource', 'myConfig',
    function($resource, myConfig) {
        return $resource(myConfig.server+'game/move', {}, {
            query: {method: 'GET', isArray: false}
        });
    }]);

