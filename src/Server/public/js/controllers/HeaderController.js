app.controller('HeaderController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {

	$scope.logIned = $cookies.get('_id') != undefined;

	$scope.user = {};
    $scope._id = $cookies.get('_id');

    if ($scope._id != undefined) {
        $scope._id = $cookies.get('_id').replace(/\"/g,'');
    }

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

	$scope.background = function(){
		if($scope.messenger){
			return '#5C5AFF';
		}
		else{
			return '#ffa337';
		}
	}

}]);
