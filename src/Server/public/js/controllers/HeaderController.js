app.controller('HeaderController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {

	$scope.user = {};
	$scope._id = $cookies.get('_id');

	$scope.load = function() {
        $http.get('/api/user/get/' + $scope._id)
			.success(function(data) {
				$scope.user = data[0];         
			})
			.error(function(data) {
				
			});
    }

	$scope.logIned = $scope._id != undefined;
    if ($scope.logIned) {
        $scope._id = $scope._id.replace(/\"/g, '');
        $scope.load();
    }

}]);
