(function () {
    'use strict';
    var moduleName = 'ShowLocationsCtrl';

    angular.module(moduleName, []);

    var ShowLocationsController = function ($scope, $rootScope, $stateParams) {
        console.log('Load show locations');
    };

    //Declaro controllador
    angular.module(moduleName)
        .controller('ShowLocationsController', ['$scope',"$rootScope", "$stateParams", ShowLocationsController]);

})();