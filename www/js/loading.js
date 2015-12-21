'use strict';

var pusherLoadingService = angular.module('pusherLoading', []);

pusherLoadingService.service('LoadingServices', [
    '$ionicLoading',
    function($ionicLoading) {
        var service = {
            showLoading: function(bool, text) {
                if (bool) {
                    $ionicLoading.show({
                        template: '<ion-spinner></ion-spinner><br />'+text,
                        hideOnStageChange: true
                    });
                } else {
                    $ionicLoading.hide();
                }
            }
        };
        return service;
    }]);

