app.controller('MyRequestController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies,uiGmapGoogleMapApi) {

	$scope.load = function() {
		$('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
    });
	};
	$scope.load();

	$scope.reqtype = "All";

	$scope.lists = [{

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

	$scope.getAllQuests = function() {
		var sender_id = $cookies.get('_id').replace(/\"/g, "");
		$http.get('/api/request/' + sender_id)
		.success(function(data) {
			console.log(data);

			angular.forEach(data, function(value, key) {
				$scope.lists.push(value);
			});

			console.log($scope.lists);
		})
		.error(function(data) {
			console.log(data);
		});
	}

	// twice calling
	$scope.getAllQuests();

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
