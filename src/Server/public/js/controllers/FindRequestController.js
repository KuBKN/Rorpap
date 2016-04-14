app.controller('FindRequestController', ['$scope', '$http','$cookies', 'profileViewer', 'loadUser', 'requestColor', 'requestParcelImg', function($scope, $http, $cookies, profileViewer, loadUser, requestColor, requestParcelImg, uiGmapGoogleMapApi){

	$scope.filter = { prices_max: 80, prices_min: 20, weight_max: 10, weight_min: 1 };
	$scope.requests = [];

	$scope.getRequests = function() {
		var reqtype = "Pending";

		var sender_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/get_request/' + reqtype + '/!' + sender_id)
			.success(function(data) {			

				$scope.accepts = [];
				$scope.getAllAccept().then(function(result){
					 angular.forEach(result, function(value,key){
					 	$scope.accepts.push(value.request_id);
					 });					 
					$scope.requests = [];
					data.sort(function(a,b) {return (a._id < b._id) ? 1 : (
														(a._id > b._id) ? -1 : 0 );
										} );
					angular.forEach(data, function(value, key) {
						if($scope.accepts.indexOf(value._id) == -1){
							loadUser.getUser(value.sender_id).then(function(result){
		   						value.sender = result;
		   					});
		   					value.pimg = requestParcelImg.getByIndex(value.img);
							$scope.requests.push(value);
						}
					});					
				});				

			}).error(function(data) {
				console.log(data);
			});
	};

	$scope.getRequests();

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});

	    var slider = document.getElementById('price-input');
	    noUiSlider.create(slider, {
	     	start: [20, 80],
	       	connect: true,
	       	step: 1,
	       	range: {
	         'min': 0,
	         'max': 100
	       },
	       format: wNumb({
	         decimals: 0
	       })
	     });

	    slider.noUiSlider.on('change', function( values, handle ) {	    		    	
			if ( handle ) {				
				$scope.filter.prices_max = parseInt(values[handle]);
			} else {
				$scope.filter.prices_min = parseInt(values[handle]);
			}
			$scope.getRequests();
		});

	    slider = document.getElementById('weight-input');
	    noUiSlider.create(slider, {
	     	start: [1, 10],
	       	connect: true,
	       	step: 0.1,
	       	range: {
	         'min': 0.1,
	         'max': 15
	       },
	       format: wNumb({
	         decimals: 0
	       })
	     });

	    slider.noUiSlider.on('change', function( values, handle ) {	    		    	
			if ( handle ) {				
				$scope.filter.weight_max = parseFloat(values[handle]);
			} else {
				$scope.filter.weight_min = parseFloat(values[handle]);
			}
			$scope.getRequests();
		});

	};
	$scope.load();

	$scope.hours = ['00','01','02','03','04','05','06','07','08','09','10','11',
	'12','13','14','15','16','17','18','19','20','21','22','23'];

	$scope.mins = ['00','01','02','03','04','05','06','07','08','09','10','11',
	'12','13','14','15','16','17','18','19','20','21','22','23',
	'24','25','26','27','28','29','30','31','32','33','34','35',
	'36','37','38','39','40','41','42','43','44','45','46','47',
	'48','49','50','51','52','53','54','55','56','57','58','59'];

	$scope.reqBackground = function(type) {
		return requestColor.getColor(type);
	};
	
	$scope.seeUser = function(user){
		profileViewer.seeUser(user);
	};

 	$scope.accept = {};

	$scope.acceptRequest = function() {		
		var messenger_id = $cookies.get('_id').replace(/\"/g, "");
		var date_t = $scope.accept.date_t;
		$scope.accept.date = date_t.getDate()+"/"+(date_t.getMonth()+1)+"/"+date_t.getFullYear();
		$http.post('/api/acceptance/add/' + messenger_id + "/" + $scope.curreq._id, $scope.accept)
		.success(function(data) {
			console.log(data);
			window.location.reload();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	$scope.getAllAccept = function(){
		var messenger_id = $cookies.get('_id').replace(/\"/g, "");
    	return $http.get('/api/acceptance/getbymess/' + messenger_id)
			.then(function(data) {
				return data.data;
			});
    };

    $scope.openModal = function(index){		       
        $('#modalAccept').openModal();
        $scope.curreq = $scope.requests[index];       
    };

    $scope.calNear = function(req){

    	return true;
    };

    $scope.path = [];
    $scope.markers = [];
    $scope.filted = function(index){
    	var price =  parseInt($scope.requests[index].price);
    	var weight =  parseInt($scope.requests[index].weight);
    	var near = true;
    	if($scope.path.length != 0){
    		near = $scope.calNear($scope.requests[index]);
    	}
    	return ($scope.filter.prices_min <= price && price <= $scope.filter.prices_max)
    	 && ($scope.filter.weight_min <= weight && weight <= $scope.filter.weight_max)
    	 && near;
    };

    $scope.map = {
		center: [
			13.738432,
			100.530925
		],
		zoom: 12,
		zoomToIncludeMarkers: false
	};	

    $scope.updateMarkers = function(index){    	
		var loc = $scope.requests[index].fromLoc.split(', ');		
		$scope.markers.push({ pos: [loc[0],loc[1]],
								optimized: true,
								icon: { url:'images/LOGO-RED.png',
						        		scaledSize:[40,40]
						      	} 
						    });
		loc = $scope.requests[index].toLoc.split(', ');
		$scope.markers.push({ pos: [loc[0],loc[1]],
								optimized: true,
								icon: { url:'images/LOGO-GREEN.png',
						        		scaledSize:[40,40]
						      	} 
						    });
	};

    $scope.showInMap = function(index){
	    console.log($scope.path);
    	$scope.map.zoomToIncludeMarkers = 'auto';
		$scope.markers = [];
		if (index != $scope.lastCollepsed) {
			$scope.updateMarkers(index);
			$scope.lastCollepsed = index;
		}
		else {			
			$scope.lastCollepsed = -1;
			$scope.map.center = [13.738432, 100.530925];
			$scope.map.zoom = 12;
			$scope.map.zoomToIncludeMarkers = false;					
		}
	};
	$scope.lastCollepsed = -1;

    $scope.showFilter = false;
    
    $scope.countM = 0;
    $scope.markerO = [];
    $scope.$on('mapInitialized', function(event, map) {
			 $scope.rmap = map;
			 // $scope.rmap.directionsRenderers[0].setOptions({
				//   map: map,
				//   suppressMarkers : true
				// });

			 $scope.rmap.directionsRenderers[0].setOptions( { markerOptions: {
			 	icon: 'images/LOGO-ORANGE.png' }
			 } );
		});
    $scope.addMarker = function(event) {
    	if($scope.countM < 2){
			var e = event.latLng;
			var pos = [e.lat(),e.lng()];
			if($scope.countM==0){
				var originM = {};
				originM.pos = pos;
				originM.optimized = false;
				originM.icon = 'images/LOGO-GREEN.png'
				$scope.markerO.push(originM);				
				$scope.origin = pos;
			}else{
				$scope.des = pos;
				$scope.markerO = [];
				setTimeout(function(){
				    $scope.path = $scope.rmap.directionsRenderers[0].directions.routes[0].overview_path;
				    $scope.getRequests();
				    console.log($scope.rmap)
				}, 500);						
			}
			$scope.countM+=1;						
		}

	};



}]);
