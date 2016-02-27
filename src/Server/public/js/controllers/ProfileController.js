app.controller('ProfileController', ['$scope', '$rootScope', '$http', '$cookies', '$window', function($scope, $rootScope, $http, $cookies, $window) {

    $scope.user = $rootScope.user;

    $scope.update = function() {
        if ($scope.user.password != "" && $scope.user.password != undefined)
            $scope.user.password = CryptoJS.MD5($scope.user.password).toString();
        else {
            $scope.user.password = "";
        }

        $http.post('/api/user/update', $scope.user)
            .success(function(data) {

                window.location.reload();
            })
            .error(function(data) {
                console.log(data);
            });
    };

    $scope.enroll = function() {
        $http.post('/api/user/enroll', {_id: $scope._id})
            .success(function(data) {

                window.location.reload();
            })
            .error(function(data) {
                console.log(data);
            });
    }

}]);
