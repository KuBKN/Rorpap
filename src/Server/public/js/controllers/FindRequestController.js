app.controller('FindRequestController', ['$scope', '$http','$cookies', 'profileViewer', 'loadUser', function($scope, $http, $cookies, profileViewer, loadUser, uiGmapGoogleMapApi){

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
	
	$scope.seeUser = function(user){
		profileViewer.seeUser(user);
	};

	$scope.requests = [];

	$scope.getRequests = function(reqtype) {
		reqtype = "Pending";

		var sender_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/get_request/' + reqtype + '/!' + sender_id)
			.success(function(data) {

				$scope.requests = [];

				angular.forEach(data, function(value, key) {
					loadUser.getUser(value.sender_id).then(function(result){
   						value.sender = result;
   					});
					$scope.requests.push(value);
				});

			}).error(function(data) {
				console.log(data);
			});
	};

	$scope.getRequests();

	$scope.acceptRequest = function(index) {
		var messenger_id = $cookies.get('_id').replace(/\"/g, "");
		//$http.post('/api/request/accept/' + messenger_id, $scope.requests[index])
		$http.post('/api/acceptance/add/' + messenger_id + "/" + $scope.requests[index]._id)
		.success(function(data) {
			console.log(data);
			window.location.reload();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

}]);
