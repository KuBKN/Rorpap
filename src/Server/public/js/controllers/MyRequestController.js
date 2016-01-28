app.controller('MyRequestController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies, uiGmapGoogleMapApi) {

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
		});
	};
	$scope.load();

	$scope.requests = [{

		type: 'Pending',
		sender_id: 'Knot',
		receiver_id: 'Nop',

		image: '1st',
		title: 'First Request',
		fromLoc: 'KU',
		toLoc: 'CU',
		vehicles: ['car','bike'],
		price: 99,
		comment: 'Song hai noy na',

		reqLimitDate: '25/01/2016',
		reqLimitTime: '00.00',
		shipLimitDate: '28/01/2016',
		shipLimitTime: '23.59'

	},{
		type: 'In progress',
		sender_id: 'Knot',
		messenger_id: 'Bat',
		receiver_id: 'Nop',

		image: '2nd',
		title: 'Second Request',
		fromLoc: 'KU',
		toLoc: 'KMUTT',
		vehicles: ['motorbike'],
		price: 199,
		comment: 'Song sha don teep',

		reqLimitDate: '24/01/2016',
		reqLimitTime: '00.00',
		shipLimitDate: '27/01/2016',
		shipLimitTime: '23.59',

		currentLoc: [{
			time: '201601011111',
			loc: 'Barn Bat'
		},{
			time: '201602022222',
			loc: 'Barn Nop'
		}]
	},{
		type: 'Finished',
		sender_id: 'Knot',
		messenger: 'Bat',
		receiver_id: 'Nop',

		image: '3rd',
		title: 'Third Request',
		fromLoc: 'KU',
		toLoc: 'ABAC',
		vehicles: ['bike'],
		price: 299,
		comment: 'Kon song lor mak',

		reqLimitDate: '23/01/2016',
		reqLimitTime: '00.00',
		shipLimitDate: '26/01/2016',
		shipLimitTime: '23.59',

		currentLoc: [{
			time: '201603031111',
			loc: 'Barn Nop'
		},{
			time: '201604042222',
			loc: 'Barn Knot'
		}]
	}];

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

			$scope.requests = [{

				type: 'Pending',
				sender_id: 'Knot',
				receiver_id: 'Nop',

				image: '1st',
				title: 'First Request',
				fromLoc: 'KU',
				toLoc: 'CU',
				vehicles: ['car','bike'],
				price: 99,
				comment: 'Song hai noy na',

				reqLimitDate: '25/01/2016',
				reqLimitTime: '00.00',
				shipLimitDate: '28/01/2016',
				shipLimitTime: '23.59'

			},{
				type: 'In progress',
				sender_id: 'Knot',
				messenger_id: 'Bat',
				receiver_id: 'Nop',

				image: '2nd',
				title: 'Second Request',
				fromLoc: 'KU',
				toLoc: 'KMUTT',
				vehicles: ['motorbike'],
				price: 199,
				comment: 'Song sha don teep',

				reqLimitDate: '24/01/2016',
				reqLimitTime: '00.00',
				shipLimitDate: '27/01/2016',
				shipLimitTime: '23.59',

				currentLoc: [{
					time: '201601011111',
					loc: 'Barn Bat'
				},{
					time: '201602022222',
					loc: 'Barn Nop'
				}]
			},{
				type: 'Finished',
				sender_id: 'Knot',
				messenger: 'Bat',
				receiver_id: 'Nop',

				image: '3rd',
				title: 'Third Request',
				fromLoc: 'KU',
				toLoc: 'ABAC',
				vehicles: ['bike'],
				price: 299,
				comment: 'Kon song lor mak',

				reqLimitDate: '23/01/2016',
				reqLimitTime: '00.00',
				shipLimitDate: '26/01/2016',
				shipLimitTime: '23.59',

				currentLoc: [{
					time: '201603031111',
					loc: 'Barn Nop'
				},{
					time: '201604042222',
					loc: 'Barn Knot'
				}]
			}];

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
