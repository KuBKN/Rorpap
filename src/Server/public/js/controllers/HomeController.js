app.controller('HomeController', ['$scope','trackingRequest', function($scope,trackingRequest) {
	$scope.images = [
		'images/woman.jpg',
		'images/pic3.jpg',
		'images/man.jpg',
		'images/2bikers.jpg',
		'images/gift.jpg',
		'images/wdriver.jpg'
	];

	$scope.setTrackingRequest = function(){
		trackingRequest.setRequest($scope.tracking_no);
	};
}]);