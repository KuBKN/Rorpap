app.controller('NewRequestController', ['$scope', '$http', '$cookies', '$location', '$timeout', 'loadUser', 'requestParcelImg', 'requestEditor', function($scope, $http, $cookies, $location, $timeout, loadUser, requestParcelImg, requestEditor) {

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

	$scope.parcelImgs = requestParcelImg.getAll();

	$scope.chooseImg = function(index){
		$scope.request.img = index;
	};

	$scope.chooseImg(3);

	$scope.createQuest = function() {
		if (!$scope.checkLogin()){
			return;
		}

		$scope.request.fromLoc = $scope.markers[0].position[0] + ', ' + $scope.markers[0].position[1];
		$scope.request.toLoc = $scope.markers[1].position[0] + ', ' + $scope.markers[1].position[1];
		var d = new Date($scope.request.shipLimitDate_tmp);
		$scope.request.shipLimitDate = ""+d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear();
		console.log($scope.request);
		if($scope.editMode){
			$http.post('/api/request/update', $scope.request)
			.success(function(data) {
				$scope.request = {};
				$scope.request.sender_id = $scope.get_id();

				$location.path('/myrequest');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		}else{
			$http.post('/api/request/create', $scope.request)
			.success(function(data) {
				$scope.request = {};
				$scope.request.sender_id = $scope.get_id();

				$location.path('/myrequest');
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
		}

	};

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
		else {
			$scope.setPrice();
		}
	}

	$scope.drag = function(event,index){
		var e = event.latLng;
		$scope.markers[index].position = [e.lat(),e.lng()];

		$scope.setPrice();
	}

	$scope.editMode = false;
	$scope.fullEdit = true;

	if(requestEditor.getReq() != null){
		$scope.request = requestEditor.getReq();
		var shipLD = $scope.request.shipLimitDate.split("/");
		$scope.request.shipLimitDate_tmp = new Date(shipLD[1]+"/"+shipLD[0]+"/"+shipLD[2]);
		$scope.request.size_w = parseFloat($scope.request.size_w);
		$scope.request.size_l = parseFloat($scope.request.size_l);
		$scope.request.size_h = parseFloat($scope.request.size_h);
		$scope.request.weight = parseFloat($scope.request.weight);
		$scope.editMode = true;
		$scope.fullEdit = requestEditor.getReq().type == "Pending";
	};

	if ($scope.editMode) {
		$scope.addMarker({
			latLng: {
				lat: function(){
					return $scope.request.fromLoc.split(', ')[0];
				},
				lng: function(){
					return $scope.request.fromLoc.split(', ')[1];
				}
			}
		});
		$scope.addMarker({
			latLng: {
				lat: function(){
					return $scope.request.toLoc.split(', ')[0];
				},
				lng: function(){
					return $scope.request.toLoc.split(', ')[1];
				}
			}
		});
	};


	// Price bar
	$scope.priceMin = 0;
	$scope.priceMax = 0;

	var rad = function(x) {
	  return x * Math.PI / 180;
  	};

	var getDistance = function(p1, p2) {
	  var R = 6378137; // Earth’s mean radius in meter
	  var dLat = rad(p2[0] - p1[0]);
	  var dLong = rad(p2[1] - p1[1]);
	  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
	    Math.cos(rad(p1[0]) * Math.cos(rad(p2[0]))) *
	    Math.sin(dLong / 2) * Math.sin(dLong / 2);
	  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	  var d = R * c;
	  return d; // returns the distance in meter
	};

	var getPrice1 = function(dis, vol, day) {
		return ((5 * dis) + (vol / 100)) / day;
	};

	var getPrice2 = function(dis, wei, day) {
		return ((5 * dis) + (wei * 100)) / day;
	};

	$scope.setPrice = function() {
		if ($scope.markers[0] != undefined && $scope.markers[1] != undefined &&
		$scope.request.size_w != undefined && $scope.request.size_l != undefined && $scope.request.size_h != undefined &&
		$scope.request.weight != undefined && $scope.request.shipLimitDate_tmp != undefined) {

			var dis = getDistance($scope.markers[0].position, $scope.markers[1].position) / 1000;
			var vol = $scope.request.size_w * $scope.request.size_l * $scope.request.size_h;
			var wei = $scope.request.weight;
			var day = Math.ceil(Math.abs($scope.request.shipLimitDate_tmp.getTime() - new Date().getTime()) / (1000 * 3600 * 24)); ;
			var p1 = Math.ceil(getPrice1(dis, vol, day));
			var p2 = Math.ceil(getPrice2(dis, wei, day));

			var min = Math.min(p1, p2);
			var max = Math.max(p1, p2);
			
			$scope.request.price = Math.ceil((min + max) / 2);
			$scope.priceMin = min;
			$scope.priceMax = max;

			console.log("dis: " + dis);
			console.log("vol: " + vol);
			console.log("wei: " + wei);
			console.log("day: " + day);
			console.log("p1: " + p1);
			console.log("p2: " + p2);
			console.log("av: " + $scope.request.price);
		}
		else {
			$scope.request.price = 0;
			$scope.priceMin = 0;
			$scope.priceMax = 0;
		}
	}




}]);
