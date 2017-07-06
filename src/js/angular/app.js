/**
 * Created by juan on 29/02/16.
 */
(function () {
    'use strict';

    var app = angular.module("appTest", [
        'ui.router'
    ]);

    app
        .controller("MainCtrl", function($scope, $rootScope, $timeout) {
            $scope.$on('cfpLoadingBar:completed', function(event, data) {
                angular.element(".animated").addClass("fadeIn");
            });
        })
        .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
            $stateProvider
                .state('place-list', {
                    url: '/place-list',
                    templateUrl: 'admin/place-list',
                    controller: 'PlaceAdListController'
                })
                .state('place-new', {
                    url: '/place-new',
                    templateUrl: 'admin/place-new',
                    controller: 'PlaceAdCreationController'
                });


            $locationProvider.html5Mode(true);
        })
        .filter('unsafe', function($sce) {
            return function(value) {
                if (!value) { return ''; }
                return $sce.trustAsHtml(value);
            };
        });
})();