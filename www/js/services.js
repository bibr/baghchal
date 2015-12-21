'use strict';

var pusherServices = angular.module('pusherServices', ['myApp.config']);

pusherServices.factory('channelManager', ['$pusher', 'myConfig', 'StartGame',
    function($pusher, myConfig, StartGame) {
        var client;
        var pusher;
        var channel;
        var myGameChannel;
        var playingChannel;

        return {
            get: function() {
                return channel;
            },
            check: function() {
                return pusher;
            },
            setMyGameChannel: function(channel) {
                myGameChannel = channel;
            },
            getMyGameChannel: function() {
                return myGameChannel;
            },
            createPrivateChannel: function(user) {
                var privateChannel = pusher.subscribe('presence-mychannel-' + user);
                return privateChannel;
            },
            set: function(player) {
                var option = {
                    authTransport: 'jsonp',
                    authEndpoint: myConfig.auth,
                    auth: {
                        params: {
                            playAs: player
                        }
                    }
                };
                client = new Pusher(myConfig.pusher, option);
                pusher = $pusher(client);
            },
            start: function() {
                channel = pusher.subscribe('presence-join-game');
            },
            stop: function() {
                channel = pusher.unsubscribe('presence-join-game');
            },
            unsubscribe: function(channelName) {
                pusher.unsubscribe(channelName);
            },
            subscribe: function(channelName) {
                pusher.subscribe(channelName);
            },
            destory: function() {
                pusher.disconnect();
            },
            getPlayingChannel: function() {
                return playingChannel;
            },
            joinGame: function(channelInfo, me) {
                if(!pusher.channel(channelInfo))
                    playingChannel = pusher.subscribe(channelInfo);

                var players = {
                    'Goat': function() {
                        return true;
                    },
                    'Tiger': function() {
                        return false;
                    }
                };
                if (typeof players[me] !== 'function') {
                    throw new Error('Invalid action.');
                }
//                var data = {playingChannel: playingChannel};
                var data = {playingChannel: playingChannel, callFactory: players[me]()};
                return data;
            }
        };
    }]);