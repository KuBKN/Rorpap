app.controller('InProgressQuestController', ['$scope', '$http','$cookies', function($scope, $http, $cookies, uiGmapGoogleMapApi){

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});

	};
	$scope.load();

	$scope.requests = [];

	$scope.getRequests = function(reqtype) {
		reqtype = "Inprogress";

		var messenger_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/get_quest/' + reqtype + '/' + messenger_id)
			.success(function(data) {

				$scope.requests = [];

				angular.forEach(data, function(value, key) {
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
	}

}]);
