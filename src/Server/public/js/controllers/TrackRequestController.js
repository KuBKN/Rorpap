app.controller('TrackRequestController', ['$scope', '$http', 'trackingRequest', 'NgMap', function($scope,$http,trackingRequest,NgMap) {

	$scope.markers = [];
	$scope.getTracking = function(){
		var req_id = trackingRequest.getRequest();		
		$http.get('/api/request/get/'+req_id).then(function(request){
			var loc = request.data[0].fromLoc.split(', ');
			$scope.markers.push({ pos: [loc[0],loc[1]],
									optimized: true,
									icon: { url:'images/LOGO-RED.png',
							        		scaledSize:[40,40]
							      	} 
							    });
			loc = request.data[0].toLoc.split(', ');
			$scope.markers.push({ pos: [loc[0],loc[1]],
									optimized: true,
									icon: { url:'images/LOGO-GREEN.png',
							        		scaledSize:[40,40]
							      	} 
							    });
			$http.get('/api/tracking/' + req_id)
			.then(function(trackings) {						
				$scope.path = [];
				$scope.tracking = [];						
				$scope.trackers = [];				
				var dot;				
				for (var i = 0; i < trackings.data.length; i++) {
					var loc = trackings.data[i].location.split(',');
					dot = [Number(loc[0]), Number(loc[1])];						
					$scope.path.push(dot);
					$scope.tracking.push(trackings.data[i].date);
					var ico = 'images/tracking_icon.png';
					var scale = [10,10];
					var anchor = [5,6.5];
					if(i==trackings.data.length-1 && request.data[0].type == "Inprogress"){
						ico = 'images/LOGO-BLUE.png';
						scale = [40,40];
						anchor = [20,40];
					}
					$scope.trackers.push({ pos: dot,
									optimized: true,
									icon: { url: ico,
										    scaledSize: scale,
										    anchor: anchor
										}
				    				});
				}								
			});
		});
	};
	$scope.map = {
		center: [
			13.738432,
			100.530925
		],
		zoom: 12,
		zoomToIncludeMarkers: true
	};
    $scope.getTracking();
	NgMap.getMap().then(function(map) {
	    $scope.rmap = map;
	    console.log('set Rmap');
	});
	console.log('After set Rmap');
	$scope.showwindow = function(event,index){
    	var d = new Date($scope.tracking[index]);
    	$scope.date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
    	$scope.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();   	  
    	$scope.rmap.showInfoWindow('bar',this);    
    }
}]);