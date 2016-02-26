app.controller('BeAMessengerController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {

    $scope.user = {};
    $scope._id = $cookies.get('_id');

    $scope.loadUser = function() {
        $http.get('/api/user/get/' + $scope._id)
            .success(function(data) {
                $scope.user = data[0];            
            })
            .error(function(data) {
                
            });
    }

    if ($scope._id != undefined) {
        $scope._id = $cookies.get('_id').replace(/\"/g,'');
        $scope.loadUser();
    }

    $scope.openModal = function(){
        
        $('#modalSignup').openModal();
    }

}]);
