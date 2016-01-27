app.controller('FindRequestController', ['$scope', function($scope){

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});
	};
	$scope.load();

	$scope.requests = [
	{
		id: 1
	},
	{
		id: 2
	}];

	$scope.distance = function( val1, val2){
		console.log(val1);
		console.log(val2);
		return (val1+val2)/2;
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