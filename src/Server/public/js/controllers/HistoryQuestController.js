app.controller('HistoryQuestController', ['$scope', '$http','$cookies', 'loadUser', 'profileViewer', function($scope, $http, $cookies, loadUser, profileViewer, uiGmapGoogleMapApi){

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
		reqtype = "Finished";

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

}]);
