'use strict';

var pusherControllers = angular.module('pusherControllers', []);

pusherControllers.controller('StartCtrl',
        ['GameServices', '$scope', 'localStorageService', 'CanvasServices', 'Move',
            function startController(GameServices, $scope, localStorageService, CanvasServices, Move) {
                if (!GameServices.checkData($scope.tiger) || !GameServices.checkData($scope.player)) {
                    $scope.tiger = localStorageService.get('tiger');
                    $scope.goat = localStorageService.get('goat');
                    $scope.player = localStorageService.get('me');
                }

                GameServices.checkPusher();
                $scope.game = GameServices
                        .getGame($scope.tiger, $scope.goat);

                $scope.showGame = function(id) {
                    if (id) {
                        GameServices.suscribeGame($scope.tiger, $scope.goat, $scope.player);
                    }
                    return (id) ? true : false;
                };

                $scope.loadCanvas = function() {

                    GameServices.PlayerMove(function(event){
                        
                        if(event.valid){
                            console.log(event)
                            $scope.game = event.gameStat;
                                CanvasServices.drawCanvas($scope);
                        }
                    });
                    //load board
                    var board = CanvasServices.drawCanvas($scope);
                    //load tiger
//                    LoadAnimalServices.insertAnimal($scope.game.tiger_position, 'img/Tiger-icon.png');

                    //load goat
                    // LoadAnimalServices.insertAnimal($scope.game.goat_position, 'img/Goat.jpg');
                    board.addEventListener('click', function(event) {
                        var action = CanvasServices.clickCanvas(event, $scope);
                        if (action) {
                            Move.query({tiger: $scope.tiger, goat: $scope.goat, move: $scope.move, player: $scope.player});
                        }
                    });
                };
                

            }
        ]);



pusherControllers.controller('PusherCtrl', [
    'channelManager',
    '$state',
    '$scope',
    'Auth',
    'BroadCastServices',
    'StartGame',
    '$timeout',
    'LoadingServices',
    function(channelManager, $state, $scope, Auth, BroadCastServices, StartGame, $timeout, LoadingServices) {
//        $scope.Auth = Auth;  
//        LoadingServices.showLoading(false, 'Loading...');
        $scope.showLoading = function(bool) {
            LoadingServices.showLoading(bool, 'Loading...');
        };

        $scope.homePage = function() {
            BroadCastServices.goHome();
            $state.go('login');
        };

        $scope.checkForm = function(formValid) {
            if (!formValid) {
                window.plugins.toast.showShortBottom(
                        "Press back button again to exit", function(success) {
                        }, function(error) {
                });
            }
            return formValid;
        };

        $scope.init = function(player) {
            $scope.player = player;
            channelManager.set(player);
            channelManager.start();
            $state.go('joingame');
        };

        $scope.challenge = function challenge(opponent) {
            var args = {
                opponent: opponent,
                privateChannel: channelManager.createPrivateChannel(opponent)
            };
            BroadCastServices.notify(args);
            $scope.isDisabled = true;
            LoadingServices.showLoading(true, 'Waiting for response...');
        };

        BroadCastServices.Challenged($scope, function(event, args) {
            BroadCastServices.bind(args.privateChannel, $scope);
        });

        BroadCastServices.ChallengeResponse($scope, function(event, args) {
            LoadingServices.showLoading(false, 'Loading...');
            if (args.accepted === "true") {
                var gameChannel = channelManager.joinGame(args.gameChannel, $scope.player);
                $scope.tiger = args.tiger;
                $scope.goat = args.goat;
                BroadCastServices.JoinGame(gameChannel, function() {
                    BroadCastServices.StoreData($scope.player, args.tiger, args.goat);
                });
                if (gameChannel.callFactory)
                    StartGame.query({tiger: args.tiger, goat: args.goat});
                $state.go('playgame');
                //$timeout(function() {
                //need to have some time to let all the meembers subscribe to the game channel.

                // }, 10);

            } else {
                window.plugins.toast.showShortBottom(
                        "Game Request Rejected.", function(success) {
                        }, function(error) {
                });
                BroadCastServices.logout($scope, $state);
            }
        });

    }]);

//pusherControllers.controller('ModalCtrl',
//        function modalController($scope, $modalInstance, channelManager, Challenge, challenger) {
//
//            var id = channelManager.get().members.me.info.user;
//            var challengerInfo = challenger.info.user;
//
//            $scope.ok = function() {
//                Challenge.query({playerId: id, challengerType: challenger.info.player, challengerId: challengerInfo, accepted: true});
//                $modalInstance.close();
//            };
//            $scope.cancel = function() {
//                Challenge.query({playerId: id, challengerType: challenger.info.player, challengerId: challengerInfo, accepted: false});
//                $modalInstance.dismiss('cancel');
//            };
//
//        });