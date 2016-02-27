app.controller('BeAMessengerController', ['$scope', '$rootScope', '$http', '$cookies', '$window', function($scope, $rootScope, $http, $cookies, $window) {

    $scope.user = $rootScope.user;

    $scope.openModal = function(){
        
        $('#modalSignup').openModal();
    }

}]);
