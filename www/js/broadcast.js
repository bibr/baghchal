'use strict';

var pusherBroadCast = angular.module('pusherBroadCast', []);

pusherBroadCast.service('BroadCastServices', [
    '$rootScope',
    'channelManager', 'StartGame', 'localStorageService',
    '$ionicPopup', 'Challenge', '$ionicLoading', '$timeout',
    function($rootScope, channelManager, StartGame, localStorageService, $ionicPopup, Challenge, $ionicLoading, $timeout) {
        var service = {
            Challenged: function(scope, callback) {
                var handler = $rootScope.$on('challengeRequestSend', callback);
                scope.$on('$destroy', handler);
            },
            notify: function(args) {
                channelManager.unsubscribe('presence-join-game');
                $rootScope.$emit("challengeRequestSend", args);
            },
            bind: function(channel, scope) {
                channel.bind('App\\Events\\PlayerChallenged', function(data) {
                    $rootScope.$emit("challenge-response-result", data);
                });
            },
            ChallengeResponse: function(scope, callback) {
                var handler = $rootScope.$on('challenge-response-result', callback);
                scope.$on('$destroy', handler);
            },
            JoinGame: function(data, callback) {
                data.playingChannel.bind('App\\Events\\GameStarted', callback);
            },
            StoreData: function(me, tiger, goat) {
                localStorageService.set('tiger', tiger);
                localStorageService.set('goat', goat);
                localStorageService.set('me', me);
                localStorageService.set('gameStarted', true);
            },
            goHome: function() {
                channelManager.destory();
            },
            logout: function(scope, state) {
                scope.isDisabled = false;
                channelManager.destory();
                channelManager.set(scope.player);
                channelManager.start();
                state.reload();
            },
            displayPopUp: function(member) {
                var id = channelManager.get().members.me.info.user;
                var challengerInfo = member.info.user;
                var confirmPopup = $ionicPopup.confirm({
                    title: 'Challenged',
                    template: 'Do you Want to Play?'
                });
                $timeout(function() {
                    confirmPopup.close(); //close the popup after 10 seconds for some reason
                }, 10000);
                confirmPopup.then(function(res) {
                    if (res) {
                        Challenge.query({playerId: id, challengerType: member.info.player, challengerId: challengerInfo, accepted: true});
                    } else {
                        Challenge.query({playerId: id, challengerType: member.info.player, challengerId: challengerInfo, accepted: false});
                    }
                });
            }
        };
        return service;
    }]);

