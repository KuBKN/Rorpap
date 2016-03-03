app.controller('ProfileOtherController', ['$scope', 'profileViewer', 'loadUser', function( $scope, profileViewer, loadUser ){

	var u = profileViewer.getUser();
   	var user = loadUser.getUser(u);
   	user.then(function(result){
   		$scope.user = result;
   	});

}]);