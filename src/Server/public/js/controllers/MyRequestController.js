app.controller('MyRequestController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies, uiGmapGoogleMapApi) {

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});
	};
	$scope.load();

	$scope.requests = [];

	$scope.reqBackground = function(type){
		if (type=="Pending") {
			return '#FFBCBC';
		}else if (type=="In progress") {
			return '#BCBEFF';
		}else{
			return '#BCFFD1';
		};
	}

	$scope.getRequests = function(reqtype) {
		if (reqtype == undefined) {
			reqtype = ".*";
		}

		var sender_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/' + reqtype + '/' + sender_id)
		.success(function(data) {

			$scope.requests = [];

			angular.forEach(data, function(value, key) {
				$scope.requests.push(value);
			});

		})
		.error(function(data) {
			console.log(data);
		});
	}

	// twice calling
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

	$scope.markers = [];

	// TODO still be suck function use inteads of checking if collapse right now, 555
	$scope.showInMap = function(index) {
		$scope.markers = [];

		if (index != $scope.lastCollepsed) {
			var marker = {};
			marker.id = $scope.markers.length;
			marker.coords = {};
			var loc = $scope.requests[index].fromLoc.split(', ');
			marker.coords.latitude = loc[0];
			marker.coords.longitude = loc[1];
			marker.options = {
				draggable: false,
				icon: 'images/LOGO-RED.png'
			}
			$scope.markers.push(marker);

			var marker = {};
			marker.id = $scope.markers.length;
			marker.coords = {};
			var loc = $scope.requests[index].toLoc.split(', ');
			marker.coords.latitude = loc[0];
			marker.coords.longitude = loc[1];
			marker.options = {
				draggable: false,
				icon: 'images/LOGO-GREEN.png'
			}
			$scope.markers.push(marker);

			$scope.map.center.latitude = (parseFloat($scope.markers[0].coords.latitude) + parseFloat($scope.markers[0].coords.latitude)) / 2;
			$scope.map.center.longitude = (parseFloat($scope.markers[1].coords.longitude) + parseFloat($scope.markers[1].coords.longitude)) / 2;

			$scope.lastCollepsed = index;
		}
		else {
			$scope.lastCollepsed = -1;
			$scope.map.center.latitude = 13.738432;
			$scope.map.center.longitude = 100.530925;
		}
	};
	$scope.lastCollepsed = -1;

	$scope.map = {
		center: {
			latitude: 13.738432,
			longitude: 100.530925
		},
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
}]);
