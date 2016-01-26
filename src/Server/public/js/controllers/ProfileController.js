app.controller('ProfileController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {

    $scope.user = {};
    $scope._id = $cookies.get('_id').replace(/\"/g,'');

    $scope.load = function() {
        $http.get('/api/user/' + $scope._id)
			.success(function(data) {
				$scope.user = data[0];
                console.log(data);
			})
			.error(function(data) {
				console.log(data);
			});
    }
    $scope.load();

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
                console.log('Error: ' + data);
            });
    };

}]);