(function () {
    'use strict';
    var moduleName = 'ShowLocationsCtrl';

    angular.module(moduleName, [
        'ngMap',
        'locationService'
    ]);

    var ShowLocationsController = function ($scope, $rootScope, $stateParams, locations, NgMap) {

        // get object map
        NgMap.getMap().then(function(map) {
            $scope.map = map;
        });
        
        //Load Locations using a Factory
        $scope.markers = [];
        $scope.locations = locations;

        // Info Windows 
        $scope.info = {
            coords: "[0, 0]",
            address: "No selected",
            latitude: 0,
            longitude: 0
        }

        angular.forEach($scope.locations, function(location, locationIndex){
            console.log('Address ', location.address);
            $scope.markers.push({
                address: location.address,
                coords: "[" +location.latitude + ", " + location.longitude + "]",
                latitude: location.latitude,
                longitude: location.longitude
            })
        });

        $scope.markerClick = function(evt, locationId){
            console.log('Market Select ', locationId);
            $scope.info =  $scope.markers[locationId];
            $scope.map.showInfoWindow('foo', this);
        }

        $scope.mouseover = function() {
            console.log('mouseover');
        };
    };

    //Declaro controllador
    angular.module(moduleName)
        .controller('ShowLocationsController', ['$scope','$rootScope', '$stateParams', 'locations', 'NgMap', ShowLocationsController]);

})();