'use strict';

var pusherGame = angular.module('pusherGame', []);

pusherGame.service('GameServices', [
    '$rootScope', 'channelManager', 'CheckGame',
    function($rootScope, channelManager, CheckGame) {
        var service = {
            getGame: function(tiger, goat) {
                return  CheckGame.query({tiger: tiger, goat: goat});
            },
            checkPusher: function(player) {
                if (!channelManager.check()) {
                    channelManager.set(player);
                }
            },
            suscribeGame: function(tiger, goat, player) {
                channelManager.joinGame(tiger + '-' + goat, player);
            },
            checkData: function(data){
                return (data) ? true : false;
            },
            PlayerMove:function(callback) {
                channelManager.getPlayingChannel().bind('App\\Events\\PlayerMoved', callback);
            }
        };
        return service;
    }]);

