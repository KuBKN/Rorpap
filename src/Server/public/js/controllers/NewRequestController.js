app.controller('NewRequestController', ['$scope', '$http', '$cookies', function($scope, $http, $cookies) {
	$scope.load = function(){
		$('select').material_select();
	};

	$scope.load();

	$scope.hours = ['00','01','02','03','04','05','06','07','08','09','10','11',
	'12','13','14','15','16','17','18','19','20','21','22','23'];

	$scope.mins = ['00','01','02','03','04','05','06','07','08','09','10','11',
	'12','13','14','15','16','17','18','19','20','21','22','23',
	'24','25','26','27','28','29','30','31','32','33','34','35',
	'36','37','38','39','40','41','42','43','44','45','46','47',
	'48','49','50','51','52','53','54','55','56','57','58','59'];

	$scope.request = {};
	$scope.request.sender_id = $cookies.get('_id').replace(/\"/g, '');
	// $scope.request.title = 't';
	// $scope.request.fromLoc = 'fl';
	// $scope.request.toLoc = 'tl';
	// $scope.request.shipmentEndHour = '1';
	// $scope.request.shipmentEndMinute = '23';
	// $scope.request.receiver ='r';
	// $scope.request.vehicles = 'v';
	// $scope.request.price = '43';
	// $scope.request.comment ='cm';

	// TODO dont get vehicles
	// TODO replace " from _id cookie
	$scope.createQuest = function() {
		console.log($scope.request);
        $http.post('/api/request', $scope.request)
			.success(function(data) {
				$scope.request = {};
				$scope.request.sender_id = $cookies.get('_id').replace(/\"/g, '');

                // TODO after finish signup here
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    }

}]);
