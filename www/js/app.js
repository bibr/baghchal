'use strict';
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
//angular.module('starter', ['ionic'])

var pusherApp = angular.module('pusherApp', [
    'ionic',
//    'ngCordova',
    'pusher-angular',
    'pusherControllers',
    'pusherServices',
    'pusherDriectives',
    'pusherFactories',
    'authServices',
    'pusherBroadCast',
    'pusherGame',
//    'ui.router',
    'ui.bootstrap',
    'myApp.config',
    'LocalStorageModule',
    'pusherLoading',
    'pusherCanvas',
]);

pusherApp.run(function($rootScope, $ionicPlatform, $ionicHistory) {
    $ionicPlatform.ready(function() {

        $ionicPlatform.registerBackButtonAction(function(e) {
            if ($rootScope.backButtonPressedOnceToExit) {
                ionic.Platform.exitApp();
            }

            else if ($ionicHistory.backView()) {
                $ionicHistory.goBack();
            }
            else {
                $rootScope.backButtonPressedOnceToExit = true;
                window.plugins.toast.showShortCenter(
                        "Press back button again to exit", function(a) {
                        }, function(b) {
                }
                );
                setTimeout(function() {
                    $rootScope.backButtonPressedOnceToExit = false;
                }, 2000);
            }
            e.preventDefault();
            return false;
        }, 101);
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
})

pusherApp.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
        $urlRouterProvider.otherwise('/start');
        $stateProvider
                .state('login', {
                    url: '/start',
                    templateUrl: 'view/login.html'
                })
                .state('joingame', {
                    url: '/joingame',
                    templateUrl: 'view/joingame.html',
                    resolve: {
                        access: ["Auth", function(Auth) {
                                return Auth.isLoggedIn();
                            }]
                    },
                    controller: 'PusherCtrl'
                })
                .state('playgame', {
                    url: '/playgame',
                    templateUrl: 'view/playgame.html',
                    controller: 'StartCtrl'
                });
    }
]);

pusherApp.run(['$rootScope', '$state', 'localStorageService', function($rootScope, $state, localStorageService) {
        $rootScope.$on('$stateChangeError',
                function(event, toState, toParams, fromState, fromParams, error) {
//                    localStorageService.clearAll();
                    return $state.go('login');
                });
    }]);

pusherApp.config(function(localStorageServiceProvider) {
    localStorageServiceProvider
            .setPrefix('pusherApp')
            .setStorageType('sessionStorage');
//    .setNotify(true, true);
});
