app.controller('MyRequestController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies,uiGmapGoogleMapApi) {

	$scope.load = function() {
		$('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
	};
	$scope.load();

	$scope.reqtype = "All";

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

	$scope.getAllRequests = function() {
		var sender_id = $cookies.get('_id').replace(/\"/g, "");
		$http.get('/api/request/' + sender_id)
			.success(function(data) {
				console.log(data);

				angular.forEach(data, function(value, key) {
					$scope.requests.push(value);
				});
			})
			.error(function(data) {
				console.log(data);
			});
	}

	$scope.removeRequest = function(index) {
        $http.post('/api/request/remove', $scope.requests[index])
			.success(function(data) {

                window.location.reload();
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    };

	// twice calling
	$scope.getAllRequests();

	$scope.map = { center: { latitude: 13.851648, longitude: 100.567465 }, zoom: 15 };

}]);
