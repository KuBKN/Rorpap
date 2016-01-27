app.controller('NewRequestController', ['$scope', '$http', '$cookies','$location', '$timeout', function($scope, $http, $cookies,$location, uiGmapGoogleMapApi, $timeout) {
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

	$scope.request = {};
	$scope.request.sender_id = $cookies.get('_id').replace(/\"/g,'');

	$scope.createQuest = function() {
		console.log($scope.request)
    $http.post('/api/request', $scope.request)
    .success(function(data) {
      $scope.request = {};
      $scope.request.sender_id = $cookies.get('_id').replace(/\"/g,'');

      $location.path('/My Request');
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
  };

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
                icon: 'images/LOGO-GREEN.png' }
  };

  $scope.map1 = { 
    center: { 
    latitude: $scope.distance($scope.marker1.coords.latitude,$scope.marker2.coords.latitude), 
    longitude: $scope.distance($scope.marker1.coords.longitude,$scope.marker2.coords.longitude)
    }, 
    zoom: 12
  };

  console.log($scope.map1.center);

}]);
