app.controller('AdminController', ['$scope', '$http', '$window', function($scope, $http, $window) {

    $scope.users = [];

    $scope.getEnrolled = function() {
		$http.get('/api/admin/user_enroll')
			.success(function(data) {
				$scope.users = data;
			})
			.error(function(data) {
				console.log(data);
			});
	}
    $scope.getEnrolled();

    $scope.accept = function(index) {
        $http.post('/api/admin/user_accept', $scope.users[index])
			.success(function(data) {

                window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    }

    $scope.reject = function(index) {
        $http.post('/api/admin/user_reject', $scope.users[index])
			.success(function(data) {

                window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    }
}]);
