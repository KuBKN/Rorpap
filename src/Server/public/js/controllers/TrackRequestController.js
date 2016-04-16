app.controller('TrackRequestController', ['$scope', '$http', 'trackingRequest', function($scope,$http,trackingRequest) {
	 $scope.map = {
		center: [
			13.738432,
			100.530925
		],
		zoom: 12,
		zoomToIncludeMarkers: false
	};

	$scope.getTracking = function(){
		var req_id = trackingRequest.getRequest();
		$http.get('/api/')
		// $http.get('/api/tracking/' + req_id)
		// 	.then(function(data) {						
		// 		$scope.path = [];
		// 		$scope.tracking = [];						
		// 		$scope.trackers = [];
		// 		var dot;				
		// 		for (var i = 0; i < data.data.length; i++) {
		// 			var loc = data.data[i].location.split(',');
		// 			dot = [Number(loc[0]), Number(loc[1])];						
		// 			$scope.path.push(dot);
		// 			$scope.tracking.push(data.data[i].date);
		// 			var ico = 'images/tracking_icon.png';
		// 			var scale = [10,10];
		// 			if(i==data.data.length-1){
		// 				ico = 'images/LOGO-BLUE.png';
		// 				scale = [40,40]
		// 			}
		// 			$scope.trackers.push({ pos: dot,
		// 							optimized: true,
		// 							icon: { url: ico,
		// 								    scaledSize: scale
		// 								}
		// 		    				});
		// 		}				
		// 	});
		};
		$scope.getTracking();		
}]);