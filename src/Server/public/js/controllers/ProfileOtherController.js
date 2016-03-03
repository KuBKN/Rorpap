app.controller('ProfileOtherController', ['$scope', 'profileViewer', function( $scope, profileViewer ){

	$scope.user = profileViewer.getUser();

}]);