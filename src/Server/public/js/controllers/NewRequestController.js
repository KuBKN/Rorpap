app.controller('NewRequestController', ['$scope', '$http', '$cookies', '$location', '$timeout', 'loadUser', function($scope, $http, $cookies, $location, $timeout, loadUser) {

	$scope.load = function() {
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

	$scope.request = {};
	// TODO calculate later
	$scope.request.price = 75;

	$scope.get_id = function() {
		var _id = $cookies.get('_id');
	    if (_id != undefined) {
	        _id = _id.replace(/\"/g,'');
	    }
		return _id;
	};
	$scope.request.sender_id = $scope.get_id();

	$scope.checkLogin = function(){
		var isLogin = loadUser.isLogIned();
		if (!isLogin) {
			alert('Please Log in !');
		};
		return isLogin;
	}

	$scope.createQuest = function() {
		if (!$scope.checkLogin()){
			return;
		}
				
		$scope.request.fromLoc = $scope.markers[0].position[0] + ', ' + $scope.markers[0].position[1];
		$scope.request.toLoc = $scope.markers[1].position[0] + ', ' + $scope.markers[1].position[1];
		var d = new Date($scope.request.shipLimitDate_tmp);
		$scope.request.shipLimitDate = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
		console.log($scope.request);

		$http.post('/api/request/create', $scope.request)
		.success(function(data) {
			$scope.request = {};
			$scope.request.sender_id = $scope.get_id();

			$location.path('/myrequest');
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		
	};

	// TODO makers splash
	$scope.markers = [];

	$scope.map = {
		center: [
			13.738432,
			100.530925
		],
		zoom: 12
	};

	$scope.addMarker = function(event) {
		var e = event.latLng;
		var marker = {};
		var _id = $scope.markers.length;
		if (_id < 2) {
			marker.position = [e.lat(),e.lng()];
			marker.optimized = false;
			marker.icon = {
					        url: _id == 0 ? 'images/LOGO-RED.png' : 'images/LOGO-GREEN.png',
					        scaledSize:[40,40]
					      };

			$scope.markers.push(marker);
		}
	}

	$scope.drag = function(event,index){
		var e = event.latLng;
		$scope.markers[index].position = [e.lat(),e.lng()];
	}

}]);
