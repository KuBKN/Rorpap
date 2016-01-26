app.controller('HeaderController',['$scope', '$cookies', function($scope, $cookies){

	$scope.logIned = $cookies.get('_id') != undefined;

	$scope.messenger = true;

	$scope.background = function(){
		if($scope.messenger){
			return '#5C5AFF';
		}
		else{
			return '#ffa337';
		}
	}

}]);
