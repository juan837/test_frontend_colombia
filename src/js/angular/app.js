(function () {
    'use strict';

    var app = angular.module("appTest", [
        'ui.router',
        'ngMaterial',
        'ManageLocationsCtrl',
        'ShowLocationsCtrl',
        'firebase'
    ]);

    app
        .controller("MainCtrl", function($scope, $rootScope, $timeout) {
            $scope.$on('cfpLoadingBar:completed', function(event, data) {
                angular.element(".animated").addClass("fadeIn");
            });
        })
        .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
            $stateProvider
                .state('manage-locations', {
                    url: '/manage-locations',
                    templateUrl: '../../manageLocations.html',
                    controller: 'ManageLocationsController'
                })
                .state('show-locations', {
                    url: '/show-locations',
                    templateUrl: '../../showLocations.html',
                    controller: 'ShowLocationsController'
                });
            $urlRouterProvider.otherwise('/manage-locations');    


            $locationProvider.html5Mode(true);
        })
        .filter('unsafe', function($sce) {
            return function(value) {
                if (!value) { return ''; }
                return $sce.trustAsHtml(value);
            };
        });
})();