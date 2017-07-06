(function () {
    'use strict';
    var moduleName = 'ManageLocationsCtrl';

    angular.module(moduleName, []);

    var ManageLocationsController = function ($scope, $rootScope, $stateParams) {
        console.log('Load manage locations');
    };

    //Declaro controllador
    angular.module(moduleName)
        .controller('ManageLocationsController', ['$scope',"$rootScope", "$stateParams", ManageLocationsController]);

})();