app.controller('AdminController', ['$scope', '$http', '$window', 'profileViewer', function($scope, $http, $window, profileViewer) {

    // enrolled
    $scope.enrolledUsers = [];
    $scope.enrolledUsers_loading = true;
    $scope.getEnrolled = function() {
		$http.get('/api/admin/user_enroll')
			.success(function(data) {
				$scope.enrolledUsers = data;
                $scope.enrolledUsers_loading = false;
			})
			.error(function(data) {
				console.log(data);
			});
	}
    $scope.getEnrolled();

    $scope.accept = function(user) {
        $http.post('/api/admin/user_accept', user)
			.success(function(data) {
                window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    }

    $scope.reject = function(user) {
        $http.post('/api/admin/user_reject', user)
			.success(function(data) {
                window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    }

    // all
    $scope.users = {};
    $scope.users_loading = true;
    $scope.getUsers = function() {
		$http.get('/api/user/get')
			.success(function(data) {
				$scope.users = data;
                $scope.users_loading = false;

                console.log($scope.users);
			})
			.error(function(data) {
				console.log(data);
			});
	}
    $scope.getUsers();

    $scope.seeUser = function(user){
		profileViewer.seeUser(user);
	};

    $scope.range = function(min, max, step) {
    step = step || 1;
    var input = [];
    for (var i = min; i <= max; i += step) {
        input.push(i);
    }
    return input;
};

}]);
