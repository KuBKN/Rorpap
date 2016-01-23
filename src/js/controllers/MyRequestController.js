app.controller('MyRequestController',['$scope',function($scope){

	$scope.load = function(){
		$('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
	};

	$scope.load();

	$scope.reqtype = "All";

	$scope.lists = [{

		type: 'Pending',
		user: 'Knot',
		receiver: 'Nop',
		
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
		user: 'Knot',
		messenger: 'Bat',
		receiver: 'Nop',

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
		user: 'Knot',
		messenger: 'Bat',
		receiver: 'Nop',

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

}]);