app.controller('InProgressQuestController', ['$scope', '$http','$cookies', 'profileViewer', 'loadUser', function( $scope, $http, $cookies, profileViewer, loadUser, uiGmapGoogleMapApi){

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});

	};
	$scope.load();

	$scope.seeUser = function(user){
		profileViewer.seeUser(user);
	};

	$scope.requests = [];

	$scope.getRequests = function(reqtype) {
		reqtype = "Inprogress";

		var messenger_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/get_quest/' + reqtype + '/' + messenger_id)
			.success(function(data) {

				$scope.requests = [];

				angular.forEach(data, function(value, key) {
					loadUser.getUser(value.sender_id).then(function(result){
   						value.sender = result;
   					});
					$scope.requests.push(value);
				});

			})
			.error(function(data) {
				console.log(data);
			});
	};

	$scope.getRequests();

	$scope.finishRequest = function(index) {
		$http.post('/api/request/finish', $scope.requests[index])
		.success(function(data) {
			window.location.reload();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

}]);
