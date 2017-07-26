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
angular.module('locationService', [
        'ngResource',
        'firebase'
     ])
    .factory('locations', function($firebaseArray) {
        var ref = firebase.database().ref().child("locations");
        return $firebaseArray(ref);
    })
    .factory("Location", ["$firebaseObject", function($firebaseObject) {
        return function(location) {
        // create a reference to the database node where we will store our data
        var ref = firebase.database().ref("locations").push();
        var profileRef = ref.child(location);

        // return it as a synchronized object
        return $firebaseObject(profileRef);
        }
    }
    ]);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuZ3VsYXIvYXBwLmpzIiwiYW5ndWxhci9jb250cm9sbGVycy9tYW5hZ2VMb2NhdGlvbnNDb250cm9sbGVyLmpzIiwiYW5ndWxhci9jb250cm9sbGVycy9zaG93TG9jYXRpb25zQ29udHJvbGxlci5qcyIsImFuZ3VsYXIvc2VydmljZXMvbG9jYXRpb25TZXJ2aWNlLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoXCJhcHBUZXN0XCIsIFtcbiAgICAgICAgJ3VpLnJvdXRlcicsXG4gICAgICAgICduZ01hdGVyaWFsJyxcbiAgICAgICAgJ01hbmFnZUxvY2F0aW9uc0N0cmwnLFxuICAgICAgICAnU2hvd0xvY2F0aW9uc0N0cmwnLFxuICAgICAgICAnZmlyZWJhc2UnXG4gICAgXSk7XG5cbiAgICBhcHBcbiAgICAgICAgLmNvbnRyb2xsZXIoXCJNYWluQ3RybFwiLCBmdW5jdGlvbigkc2NvcGUsICRyb290U2NvcGUsICR0aW1lb3V0KSB7XG4gICAgICAgICAgICAkc2NvcGUuJG9uKCdjZnBMb2FkaW5nQmFyOmNvbXBsZXRlZCcsIGZ1bmN0aW9uKGV2ZW50LCBkYXRhKSB7XG4gICAgICAgICAgICAgICAgYW5ndWxhci5lbGVtZW50KFwiLmFuaW1hdGVkXCIpLmFkZENsYXNzKFwiZmFkZUluXCIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jb25maWcoZnVuY3Rpb24oJHN0YXRlUHJvdmlkZXIsICR1cmxSb3V0ZXJQcm92aWRlciwgJGxvY2F0aW9uUHJvdmlkZXIsICRodHRwUHJvdmlkZXIpIHtcbiAgICAgICAgICAgICRzdGF0ZVByb3ZpZGVyXG4gICAgICAgICAgICAgICAgLnN0YXRlKCdtYW5hZ2UtbG9jYXRpb25zJywge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICcvbWFuYWdlLWxvY2F0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vbWFuYWdlTG9jYXRpb25zLmh0bWwnLFxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnTWFuYWdlTG9jYXRpb25zQ29udHJvbGxlcidcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5zdGF0ZSgnc2hvdy1sb2NhdGlvbnMnLCB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJy9zaG93LWxvY2F0aW9ucycsXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnLi4vLi4vc2hvd0xvY2F0aW9ucy5odG1sJyxcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1Nob3dMb2NhdGlvbnNDb250cm9sbGVyJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL21hbmFnZS1sb2NhdGlvbnMnKTsgICAgXG5cblxuICAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHRydWUpO1xuICAgICAgICB9KVxuICAgICAgICAuZmlsdGVyKCd1bnNhZmUnLCBmdW5jdGlvbigkc2NlKSB7XG4gICAgICAgICAgICByZXR1cm4gZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICAgICAgICBpZiAoIXZhbHVlKSB7IHJldHVybiAnJzsgfVxuICAgICAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNIdG1sKHZhbHVlKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xufSkoKTsiLCIoZnVuY3Rpb24gKCkge1xuICAgICd1c2Ugc3RyaWN0JztcbiAgICB2YXIgbW9kdWxlTmFtZSA9ICdNYW5hZ2VMb2NhdGlvbnNDdHJsJztcblxuICAgIGFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFtcbiAgICAgICAgJ2xvY2F0aW9uU2VydmljZSdcbiAgICBdKTtcblxuICAgIHZhciBNYW5hZ2VMb2NhdGlvbnNDb250cm9sbGVyID0gZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlUGFyYW1zLCAkZmlyZWJhc2VBcnJheSwgR2VvQ29kZXIsIGxvY2F0aW9ucykge1xuICAgICAgICBcbiAgICAgICAgLy9Mb2FkIExvY2F0aW9ucyB1c2luZyBhIEZhY3RvcnlcbiAgICAgICAgJHNjb3BlLmxvY2F0aW9ucyA9IGxvY2F0aW9ucztcblxuICAgICAgICAvLyBWYXIgTG9jYWxpdGF0aW9uXG4gICAgICAgICRzY29wZS5sb2NhdGlvbiA9IHtcbiAgICAgICAgICAgIGFkZHJlc3M6ICcnXG4gICAgICAgIH1cblxuICAgICAgICAvLyBWYXIgcGxhY2UgaW5mb1xuICAgICAgICAkc2NvcGUubG9jYXRpb25JbmZvID0ge1xuICAgICAgICAgICAgYWRkcmVzczogJycsXG4gICAgICAgICAgICBmb3JtYXR0ZWRfYWRkcmVzczogJycsXG4gICAgICAgICAgICBsYXRpdHVkZTogMCxcbiAgICAgICAgICAgIGxvbmdpdHVkZTogMCxcbiAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgIH1cblxuICAgICAgICAvLyBGdW5jdGlvbiBmaW5kIGxvY2F0aW9uIHVzaW5nIEdvb2dsZSBHZW9sb2NhdGlvbiBcbiAgICAgICAgJHNjb3BlLmZpbmRMb2NhdGlvbiA9IGZ1bmN0aW9uKGFkKXtcbiAgICAgICAgICAgIEdlb0NvZGVyLmdlb2NvZGUoe2FkZHJlc3M6IGFkfSkudGhlbihmdW5jdGlvbihyZXN1bHQpIHtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9jYXRpb25JbmZvLnZpc2libGUgPSB0cnVlO1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2NhdGlvbkluZm8uYWRkcmVzcyA9IGFkO1xuICAgICAgICAgICAgICAgICRzY29wZS5sb2NhdGlvbkluZm8uZm9ybWF0dGVkX2FkZHJlc3MgPSByZXN1bHRbMF0uZm9ybWF0dGVkX2FkZHJlc3M7XG4gICAgICAgICAgICAgICAgJHNjb3BlLmxvY2F0aW9uSW5mby5sYXRpdHVkZSA9IHJlc3VsdFswXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKTtcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9jYXRpb25JbmZvLmxvbmdpdHVkZSA9IHJlc3VsdFswXS5nZW9tZXRyeS5sb2NhdGlvbi5sbmcoKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9O1xuXG4gICAgICAgIC8vIEFkZCBuZXcgTG9jYXRpb24gaW4gRmlyZWJhc2UgRGF0YWJhc2VcbiAgICAgICAgJHNjb3BlLmFkZExvY2F0aW9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS5sb2NhdGlvbnMuJGFkZCh7XG4gICAgICAgICAgICAgICAgbmFtZTogJHNjb3BlLmxvY2F0aW9uLmFkZHJlc3MsXG4gICAgICAgICAgICAgICAgYWRkcmVzczogJHNjb3BlLmxvY2F0aW9uSW5mby5mb3JtYXR0ZWRfYWRkcmVzcyxcbiAgICAgICAgICAgICAgICBsYXRpdHVkZTogJHNjb3BlLmxvY2F0aW9uSW5mby5sYXRpdHVkZSxcbiAgICAgICAgICAgICAgICBsb25naXR1ZGU6ICRzY29wZS5sb2NhdGlvbkluZm8ubG9uZ2l0dWRlLFxuICAgICAgICAgICAgICAgIHRpbWVzdGFtcDogZmlyZWJhc2UuZGF0YWJhc2UuU2VydmVyVmFsdWUuVElNRVNUQU1QXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJHNjb3BlLmNsZWFuKCk7XG4gICAgICAgIH07XG5cblxuICAgICAgICAvLyBSZW1vdmUgYSBMb2NhdGlvbiBpbiBGaXJlYmFzZSBEYXRhYmFzZVxuICAgICAgICAkc2NvcGUucmVtb3ZlTG9jYXRpb24gPSBmdW5jdGlvbihsb2NhdGlvbil7XG4gICAgICAgICAgICAkc2NvcGUubG9jYXRpb25zLiRyZW1vdmUobG9jYXRpb24pO1xuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gQ2xlYW4gTG9jYXRpb24gSW5mb3JtYXRpb25cbiAgICAgICAgJHNjb3BlLmNsZWFuID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICRzY29wZS5sb2NhdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiAnJ1xuICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgJHNjb3BlLmxvY2F0aW9uSW5mbyA9IHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiAnJyxcbiAgICAgICAgICAgICAgICBmb3JtYXR0ZWRfYWRkcmVzczogJycsXG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6IDAsXG4gICAgICAgICAgICAgICAgbG9uZ2l0dWRlOiAwLFxuICAgICAgICAgICAgICAgIHZpc2libGU6IGZhbHNlXG4gICAgICAgICAgICB9O1xuICAgICAgICB9O1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgLy9EZWNsYXJvIGNvbnRyb2xsYWRvclxuICAgIGFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUpXG4gICAgICAgIC5jb250cm9sbGVyKCdNYW5hZ2VMb2NhdGlvbnNDb250cm9sbGVyJywgWyckc2NvcGUnLFwiJHJvb3RTY29wZVwiLCBcIiRzdGF0ZVBhcmFtc1wiLCBcIiRmaXJlYmFzZUFycmF5XCIsIFwiR2VvQ29kZXJcIiwgXCJsb2NhdGlvbnNcIiwgTWFuYWdlTG9jYXRpb25zQ29udHJvbGxlcl0pO1xuXG59KSgpOyIsIihmdW5jdGlvbiAoKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBtb2R1bGVOYW1lID0gJ1Nob3dMb2NhdGlvbnNDdHJsJztcblxuICAgIGFuZ3VsYXIubW9kdWxlKG1vZHVsZU5hbWUsIFtcbiAgICAgICAgJ25nTWFwJyxcbiAgICAgICAgJ2xvY2F0aW9uU2VydmljZSdcbiAgICBdKTtcblxuICAgIHZhciBTaG93TG9jYXRpb25zQ29udHJvbGxlciA9IGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsICRzdGF0ZVBhcmFtcywgbG9jYXRpb25zLCBOZ01hcCkge1xuXG4gICAgICAgIC8vIGdldCBvYmplY3QgbWFwXG4gICAgICAgIE5nTWFwLmdldE1hcCgpLnRoZW4oZnVuY3Rpb24obWFwKSB7XG4gICAgICAgICAgICAkc2NvcGUubWFwID0gbWFwO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgIC8vTG9hZCBMb2NhdGlvbnMgdXNpbmcgYSBGYWN0b3J5XG4gICAgICAgICRzY29wZS5tYXJrZXJzID0gW107XG4gICAgICAgICRzY29wZS5sb2NhdGlvbnMgPSBsb2NhdGlvbnM7XG5cbiAgICAgICAgLy8gSW5mbyBXaW5kb3dzIFxuICAgICAgICAkc2NvcGUuaW5mbyA9IHtcbiAgICAgICAgICAgIGNvb3JkczogXCJbMCwgMF1cIixcbiAgICAgICAgICAgIGFkZHJlc3M6IFwiTm8gc2VsZWN0ZWRcIixcbiAgICAgICAgICAgIGxhdGl0dWRlOiAwLFxuICAgICAgICAgICAgbG9uZ2l0dWRlOiAwXG4gICAgICAgIH1cblxuICAgICAgICBhbmd1bGFyLmZvckVhY2goJHNjb3BlLmxvY2F0aW9ucywgZnVuY3Rpb24obG9jYXRpb24sIGxvY2F0aW9uSW5kZXgpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ0FkZHJlc3MgJywgbG9jYXRpb24uYWRkcmVzcyk7XG4gICAgICAgICAgICAkc2NvcGUubWFya2Vycy5wdXNoKHtcbiAgICAgICAgICAgICAgICBhZGRyZXNzOiBsb2NhdGlvbi5hZGRyZXNzLFxuICAgICAgICAgICAgICAgIGNvb3JkczogXCJbXCIgK2xvY2F0aW9uLmxhdGl0dWRlICsgXCIsIFwiICsgbG9jYXRpb24ubG9uZ2l0dWRlICsgXCJdXCIsXG4gICAgICAgICAgICAgICAgbGF0aXR1ZGU6IGxvY2F0aW9uLmxhdGl0dWRlLFxuICAgICAgICAgICAgICAgIGxvbmdpdHVkZTogbG9jYXRpb24ubG9uZ2l0dWRlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9KTtcblxuICAgICAgICAkc2NvcGUubWFya2VyQ2xpY2sgPSBmdW5jdGlvbihldnQsIGxvY2F0aW9uSWQpe1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ01hcmtldCBTZWxlY3QgJywgbG9jYXRpb25JZCk7XG4gICAgICAgICAgICAkc2NvcGUuaW5mbyA9ICAkc2NvcGUubWFya2Vyc1tsb2NhdGlvbklkXTtcbiAgICAgICAgICAgICRzY29wZS5tYXAuc2hvd0luZm9XaW5kb3coJ2ZvbycsIHRoaXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgJHNjb3BlLm1vdXNlb3ZlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coJ21vdXNlb3ZlcicpO1xuICAgICAgICB9O1xuICAgIH07XG5cbiAgICAvL0RlY2xhcm8gY29udHJvbGxhZG9yXG4gICAgYW5ndWxhci5tb2R1bGUobW9kdWxlTmFtZSlcbiAgICAgICAgLmNvbnRyb2xsZXIoJ1Nob3dMb2NhdGlvbnNDb250cm9sbGVyJywgWyckc2NvcGUnLCckcm9vdFNjb3BlJywgJyRzdGF0ZVBhcmFtcycsICdsb2NhdGlvbnMnLCAnTmdNYXAnLCBTaG93TG9jYXRpb25zQ29udHJvbGxlcl0pO1xuXG59KSgpOyIsImFuZ3VsYXIubW9kdWxlKCdsb2NhdGlvblNlcnZpY2UnLCBbXG4gICAgICAgICduZ1Jlc291cmNlJyxcbiAgICAgICAgJ2ZpcmViYXNlJ1xuICAgICBdKVxuICAgIC5mYWN0b3J5KCdsb2NhdGlvbnMnLCBmdW5jdGlvbigkZmlyZWJhc2VBcnJheSkge1xuICAgICAgICB2YXIgcmVmID0gZmlyZWJhc2UuZGF0YWJhc2UoKS5yZWYoKS5jaGlsZChcImxvY2F0aW9uc1wiKTtcbiAgICAgICAgcmV0dXJuICRmaXJlYmFzZUFycmF5KHJlZik7XG4gICAgfSlcbiAgICAuZmFjdG9yeShcIkxvY2F0aW9uXCIsIFtcIiRmaXJlYmFzZU9iamVjdFwiLCBmdW5jdGlvbigkZmlyZWJhc2VPYmplY3QpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKGxvY2F0aW9uKSB7XG4gICAgICAgIC8vIGNyZWF0ZSBhIHJlZmVyZW5jZSB0byB0aGUgZGF0YWJhc2Ugbm9kZSB3aGVyZSB3ZSB3aWxsIHN0b3JlIG91ciBkYXRhXG4gICAgICAgIHZhciByZWYgPSBmaXJlYmFzZS5kYXRhYmFzZSgpLnJlZihcImxvY2F0aW9uc1wiKS5wdXNoKCk7XG4gICAgICAgIHZhciBwcm9maWxlUmVmID0gcmVmLmNoaWxkKGxvY2F0aW9uKTtcblxuICAgICAgICAvLyByZXR1cm4gaXQgYXMgYSBzeW5jaHJvbml6ZWQgb2JqZWN0XG4gICAgICAgIHJldHVybiAkZmlyZWJhc2VPYmplY3QocHJvZmlsZVJlZik7XG4gICAgICAgIH1cbiAgICB9XG4gICAgXSk7Il19
