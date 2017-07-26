(function () {
    'use strict';
    var moduleName = 'ManageLocationsCtrl';

    angular.module(moduleName, [
        'locationService'
    ]);

    var ManageLocationsController = function ($scope, $rootScope, $stateParams, $firebaseArray, GeoCoder, locations) {
        
        //Load Locations using a Factory
        $scope.locations = locations;

        // Var Localitation
        $scope.location = {
            address: ''
        }

        // Var place info
        $scope.locationInfo = {
            address: '',
            formatted_address: '',
            latitude: 0,
            longitude: 0,
            visible: false
        }

        // Function find location using Google Geolocation 
        $scope.findLocation = function(ad){
            GeoCoder.geocode({address: ad}).then(function(result) {
                $scope.locationInfo.visible = true;
                $scope.locationInfo.address = ad;
                $scope.locationInfo.formatted_address = result[0].formatted_address;
                $scope.locationInfo.latitude = result[0].geometry.location.lat();
                $scope.locationInfo.longitude = result[0].geometry.location.lng();
            });
        };

        // Add new Location in Firebase Database
        $scope.addLocation = function(){
            $scope.locations.$add({
                name: $scope.location.address,
                address: $scope.locationInfo.formatted_address,
                latitude: $scope.locationInfo.latitude,
                longitude: $scope.locationInfo.longitude,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });

            $scope.clean();
        };


        // Remove a Location in Firebase Database
        $scope.removeLocation = function(location){
            $scope.locations.$remove(location);
        };


        // Clean Location Information
        $scope.clean = function(){
            $scope.location = {
                address: ''
            };

            $scope.locationInfo = {
                address: '',
                formatted_address: '',
                latitude: 0,
                longitude: 0,
                visible: false
            };
        };
        
    };

    //Declaro controllador
    angular.module(moduleName)
        .controller('ManageLocationsController', ['$scope',"$rootScope", "$stateParams", "$firebaseArray", "GeoCoder", "locations", ManageLocationsController]);

})();