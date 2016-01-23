app.controller('HeaderController',['$scope', '$cookies', function($scope, $cookies){

	$scope.logIned = $cookies.get('_id') != undefined;

}]);
