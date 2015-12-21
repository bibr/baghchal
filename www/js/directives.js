'use strict';

var pusherDirectives = angular.module('pusherDriectives', []);

pusherDirectives.directive('collaborate', [
    '$pusher', 'channelManager', '$modal', 'BroadCastServices',
    function($pusher, channelManager, $modal, BroadCastServices) {
        var linker = function(scope, elem, attrs, template) {
            var channel = channelManager.get();

            channel.bind('pusher:subscription_succeeded', function(membersData) {
                scope.members = membersData.members;
                scope.me = channel.members.me;
                channelManager.setMyGameChannel(channelManager.createPrivateChannel(channel.members.me.info.user));
                channelManager.getMyGameChannel().bind('pusher:member_added', function(member) {
                    channelManager.unsubscribe('presence-join-game');
                    if (channelManager.getMyGameChannel().members.count === 2)
                    {
                        BroadCastServices.displayPopUp(member);
                    }

                });

                BroadCastServices.bind(channelManager.getMyGameChannel(), scope);

            });

            channel.bind('pusher:member_added', function(member) {

            });

            channel.bind('pusher:member_removed', function(member) {

            });

            channel.bind('connecting_in', function(delay) {
                alert("I haven't been able to establish a connection for this feature.  " +
                        "I will try again in " + delay + " seconds.")
            });


//            pusher.connection.bind('error', function(err) {
//                if (err.data.code === 4004) {
//                    log('>>> detected limit error');
//                }
//            });

        };
        return {
            restrict: 'A',
            link: linker
        };

    }]);