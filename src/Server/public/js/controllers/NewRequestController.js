app.controller('NewRequestController', ['$scope', '$http', '$cookies','$location', function($scope, $http, $cookies,$location) {
	$scope.load = function(){
		$('select').material_select();
		$('#mySelect').val();
	};

	$scope.load();

	$scope.hours = ['00','01','02','03','04','05','06','07','08','09','10','11',
	'12','13','14','15','16','17','18','19','20','21','22','23'];

	$scope.mins = ['00','01','02','03','04','05','06','07','08','09','10','11',
	'12','13','14','15','16','17','18','19','20','21','22','23',
	'24','25','26','27','28','29','30','31','32','33','34','35',
	'36','37','38','39','40','41','42','43','44','45','46','47',
	'48','49','50','51','52','53','54','55','56','57','58','59'];

	$scope.quest = {};
	$scope.quest.sender_id = $cookies.get('_id').replace(/\"/g,'');
	// $scope.quest.title = 't';
	// $scope.quest.fromLoc = 'fl';
	// $scope.quest.toLoc = 'tl';
	// $scope.quest.shipmentEndHour = '1';
	// $scope.quest.shipmentEndMinute = '23';
	// $scope.quest.receiver ='r';
	// $scope.quest.vehicles = 'v';
	// $scope.quest.price = '43';
	// $scope.quest.comment ='cm';

	// TODO dont get vehicles
	// TODO replace " from _id cookie
	$scope.createQuest = function() {
		console.log($scope.quest)
        $http.post('/api/quest', $scope.quest)
			.success(function(data) {
				$scope.quest = {};
				$scope.quest.sender_id = $cookies.get('_id');

                // TODO after finish signup here
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		$location.path('/My Request');
    };

}]);
