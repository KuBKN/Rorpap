app.controller('LogInController', ['$scope', '$http', '$cookies','$window', function($scope, $http, $cookies,$window) {
    $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    $scope.user = {};

	$scope.logIn = function() {
		console.log($scope.user);
		$scope.password = CryptoJS.MD5($scope.password).toString();
        $http.post('/api/user/login', $scope.user)
			.success(function(data) {
				$cookies.putObject('_id', data[0]._id);
				console.log($cookies.get('_id'));
				$window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    };

}]);
