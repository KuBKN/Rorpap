app.controller('FindRequestController', ['$scope', '$http','$cookies', '$location', 'profileViewer', 'loadUser', 'requestColor', 'requestParcelImg', function($scope, $http, $cookies, $location, profileViewer, loadUser, requestColor, requestParcelImg, uiGmapGoogleMapApi){
	
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

	$scope.filter = { prices_max: 100, prices_min: 0, weight_max: 15, weight_min: 0, scope: 2500, distance_max: 30000, distance_min: 0};
	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});		

	    var slider = document.getElementById('price-input');
	    noUiSlider.create(slider, {
	     	start: [0, 100],
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
			console.log('filted price');
			$scope.getRequests();			
		});

		slider = document.getElementById('distance-input');
	    noUiSlider.create(slider, {
	     	start: [0, 30000],
	       	connect: true,
	       	step: 100,
	       	range: {
	         'min': 0,
	         'max': 30000
	       },
	       format: wNumb({
	         decimals: 0
	       })
	     });

	    slider.noUiSlider.on('change', function( values, handle ) {	    		    	
			if ( handle ) {				
				$scope.filter.distance_max = parseInt(values[handle]);
			} else {
				$scope.filter.distance_min = parseInt(values[handle]);
			}			
			console.log('filted distance');
			$scope.getRequests();			
		});

	    slider = document.getElementById('weight-input');
	    noUiSlider.create(slider, {
	     	start: [0, 15],
	       	connect: true,
	       	step: 0.1,
	       	range: {
	         'min': 0,
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
			console.log('filted weight');
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
			$location.path('/messenger');
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

    var rad = function(x) {
	  return x * Math.PI / 180;
	};

	$scope.getDistance = function(p1, p2) {
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

    $scope.calNear = function(from,to){
    	var nearF = false;
    	var nearT = false;
    	for(var i = 0; i < $scope.path.length; i++){    	
    		var p = [$scope.path[i].lat(),$scope.path[i].lng()];
    		var distF = $scope.getDistance(from,p);
    		var distT = $scope.getDistance(to,p);    		
    		if(!nearF && distF<=$scope.filter.scope) {
    			nearF = true;
    		}
    		if (!nearT && distT<=$scope.filter.scope) {
    			nearT = true;
    		}
    		if(nearF && nearT){
    			return true;
    		}
    	}
    	return false;
    };

    $scope.path = [];
    $scope.markers = [];
    $scope.filted = function(index){		
    	var price =  parseInt($scope.requests[index].price);
    	var weight =  parseFloat($scope.requests[index].weight);
    	var inTime = true;
    	if($scope.filter.fromDate!=null && $scope.filter.toDate!=null){
    		var date = $scope.requests[index].shipLimitDate.split('/');
	    	date = new Date(date[1]+"/"+date[0]+"/"+date[2]);
	    	inTime = $scope.filter.fromDate <= date && date <= $scope.filter.toDate;
    	}

    	var from = $scope.requests[index].fromLoc.split(', ');
    	var to = $scope.requests[index].toLoc.split(', ');
    	from = [parseFloat(from[0]),parseFloat(from[1])];
    	to = [parseFloat(to[0]),parseFloat(to[1])];
    	var near = true;
    	if($scope.path.length != 0){
    		near = $scope.calNear(from,to);
    	}    	
       	var dist = $scope.getDistance(from,to);
       	var indist = $scope.filter.distance_min <= dist && dist <= $scope.filter.distance_max;

    	var inprice = $scope.filter.prices_min <= price && price <= $scope.filter.prices_max;
    	var inweight = $scope.filter.weight_min <= weight && weight <= $scope.filter.weight_max;    	
    	return inprice && inweight && near && inTime && indist;
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
			 $scope.rmap.directionsRenderers[0].setOptions( { 
			 	markerOptions: {
			 		icon: 'images/LOGO-ORANGE.png'
			 	},
			 	polylineOptions: {
			 		strokeColor: 'blue',
			 		strokeWeight: '10',
			 		strokeOpacity: '0.5'
			 	}
			 } );

			 $scope.rmap.directionsRenderers[0].addListener('directions_changed', function() {
			    $scope.updateDirection()
			  });
		});
    $scope.addMarker = function(event) {
    	if($scope.countM < 2){
			var e = event.latLng;
			var pos = [e.lat(),e.lng()];
			if($scope.countM==0){
				var originM = {};
				originM.pos = pos;
				originM.optimized = false;
				originM.icon = 'images/LOGO-ORANGE.png'
				$scope.markerO.push(originM);				
				$scope.origin = pos;
			}else{
				$scope.des = pos;
				$scope.markerO = [];
				$scope.rmap.directionsRenderers[0].setMap($scope.rmap);
				setTimeout(function(){
				    $scope.path = $scope.rmap.directionsRenderers[0].directions.routes[0].overview_path;
				    $scope.getRequests();
				}, 500);						
			}
			$scope.countM+=1;						
		}
	};

	$scope.updateDirection = function(event){
		$scope.path = $scope.rmap.directionsRenderers[0].directions.routes[0].overview_path;
		console.log('updateDirection');
		$scope.getRequests();
	};

	$scope.clearDirection = function(){
		$scope.rmap.directionsRenderers[0].setMap();
		$scope.path = [];
		$scope.origin = null;
		$scope.des = null;
		$scope.countM = 0;
		$scope.getRequests();
	};

	$scope.callNop = function(){
		// $scope.rmap.directionsRenderers[0].setOptions( { 			 	
		// 	 	polylineOptions: {
		// 	 		strokeWeight: $scope.filter.scope			 		
		// 	 	}
		// 	 });
	};

}]);

