app.controller('FindRequestController', ['$scope', '$http','$cookies', function($scope, $http, $cookies, uiGmapGoogleMapApi){

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});

	    var slider = document.getElementById('range-input');
	    noUiSlider.create(slider, {
	     	start: [20, 80],
	       	connect: true,
	       	step: 1,
	       	range: {
	         'min': 0,
	         'max': 100
	       },
	       format: wNumb({
	         decimals: 0
	       })
	     });
	};
	$scope.load();
	
	$scope.requests = [];

	$scope.getRequests = function(reqtype) {
		reqtype = "Pending";

		var sender_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/get_request/' + reqtype + '/!' + sender_id)
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

	$scope.acceptRequest = function(index) {
		var sender_id = $cookies.get('_id').replace(/\"/g, "");

		$http.post('/api/request/accept/' + sender_id, $scope.requests[index])
		.success(function(data) {

			window.location.reload();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

}]);
