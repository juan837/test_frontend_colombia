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