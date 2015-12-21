'use strict';

var authServices = angular.module('authServices', []);
authServices.factory('Auth', [
    'channelManager',
    '$q',
    'localStorageService', 'CheckGame',
    function(channelManager, $q, localStorageService, CheckGame) {
        var channel = channelManager.get();
        return{
            isLoggedIn: function() {
                channel = channelManager.get();
                var deferred = $q.defer();
                
                (channel) ? deferred.resolve(200) : deferred.reject(401);
                return deferred.promise;

            },
            gameStarted: function() {
                var deferred = $q.defer();
                var tiger = localStorageService.get('tiger');
                var goat = localStorageService.get('goat');
                var player = localStorageService.get('me');

                if (channel) {
                    deferred.resolve(200);
                } else {
                    //check in server if the game exist 
                    //if it does then subscribe to the channel 
                //    CheckGame.query({tiger: tiger, goat: goat});

                    deferred.resolve(200);
                }

                return deferred.promise;
            },
            authenticated: function() {
                channel = channelManager.get();
                
                return (channel) ? true : false;
            }
        };
    }]);