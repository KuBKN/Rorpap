app.controller('BeAMessengerController', ['$scope', '$window', 'loadUser', function($scope, $window, loadUser) {

    $scope.logIned = loadUser.isLogIned();

    if( $scope.logIned ){
        var user = loadUser.getUser();
        user.then(function(result){
            $scope.user = result;
        });
    }

    $scope.openModal = function(){
        
        $('#modalSignup').openModal();
    }

}]);
