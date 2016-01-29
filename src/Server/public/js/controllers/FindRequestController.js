app.controller('FindRequestController', ['$scope', function($scope){

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});
	};
	$scope.load();

	// TODO calculate range later
	$scope.slider = {
	    minValue: 10,
	    maxValue: 90,
	    options: {
	        floor: 0,
	        ceil: 100,
	        step: 1
	    }
	};

	$scope.requests = [
	{
		id: 1
	},
	{
		id: 2
	}];

	$scope.distance = function(val1, val2) {
		return (val1 + val2) / 2;
	};

	$scope.marker1 = {
		id: 0,
		coords: {
			latitude: 13.851648,
			longitude: 100.567465
		},
		options: { draggable: true,
			icon: 'images/LOGO-RED.png'
		}
	};

	$scope.marker2 = {
		id: 0,
		coords: {
			latitude: 13.738432,
			longitude: 100.530925
		},
		options: { draggable: true,
			icon: 'images/LOGO-GREEN.png'
		}
	};

	$scope.map1 = {
		center: {
			latitude: $scope.distance($scope.marker1.coords.latitude,$scope.marker2.coords.latitude),
			longitude: $scope.distance($scope.marker1.coords.longitude,$scope.marker2.coords.longitude)
		},
		zoom: 11
	};

}]);
