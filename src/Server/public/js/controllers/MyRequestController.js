app.controller('MyRequestController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});
	};
	$scope.load();

	$scope.reqBackground = function(type) {
		if (type == 'Pending') {
			return '#FFBCBC';
		} else if (type == 'Inprogress') {
			return '#BCBEFF';
		} else {
			return '#BCFFD1';
		};
	}

	$scope.requests = [];

	$scope.getRequests = function(reqtype) {
		if (reqtype == undefined) {
			reqtype = ".*";
		}

		var sender_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/get_request/' + reqtype + '/' + sender_id)
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

	$scope.removeRequest = function(index) {
		$http.post('/api/request/remove', $scope.requests[index])
		.success(function(data) {

			window.location.reload();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	$scope.map = {
		center: [
			13.738432,
			100.530925
		],
		zoom: 12,
		options: {
			// TODO still cannot find a way to disable changing position -_-
			scrollwheel: false,
			panControl: false,
			zoomControl: true,
			mapTypeControl: false,
			scaleControl: false,
			streetViewControl: false,
			overviewMapControl: false,
			rotateControl: false,
			disableDoubleClickZoom: true
		}
	};

	$scope.marker_from = {};
	$scope.marker_to = {};

	// TODO still be suck function use inteads of checking if collapse right now, 555
	$scope.showInMap = function(index) {
		$scope.marker_from = {};
		$scope.marker_to = {};

		if (index != $scope.lastCollepsed) {
			var loc = $scope.requests[index].fromLoc.split(', ');
			$scope.marker_from.position = [loc[0],loc[1]];
			$scope.marker_from.optimized = "false";
			$scope.marker_from.icon = {
						        url:'images/LOGO-RED.png',
						        scaledSize:[40,40]
						      };

		    var loc = $scope.requests[index].toLoc.split(', ');
			$scope.marker_to.position = [loc[0],loc[1]];
			$scope.marker_to.optimized = "false";
			$scope.marker_to.icon = {
						        url:'images/LOGO-GREEN.png',
						        scaledSize:[40,40]
						      };

			$scope.map.center= [ $scope.calculateCenter($scope.marker_from.position[0], $scope.marker_to.position[0])
								, $scope.calculateCenter($scope.marker_from.position[1], $scope.marker_to.position[1])];

			$scope.lastCollepsed = index;
		}
		else {
			$scope.lastCollepsed = -1;
			$scope.map.center = [13.738432,100.530925];
		}
	};
	$scope.lastCollepsed = -1;

	$scope.calculateCenter = function(var1, var2) {
		return (parseFloat(var1) + parseFloat(var2)) / 2;
	}

}]);
