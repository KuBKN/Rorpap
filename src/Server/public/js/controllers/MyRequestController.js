app.controller('MyRequestController', ['$scope', '$http', '$cookies', '$location', 'loadUser', 'profileViewer', 'requestColor', 'requestParcelImg', 'requestEditor', 'NgMap', function($scope, $http, $cookies, $location, loadUser, profileViewer, requestColor, requestParcelImg, requestEditor, NgMap) {

    NgMap.getMap().then(function(map) {
	    $scope.rmap = map;
	    console.log('set Rmap');
	});

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});
		$('select').material_select();
		$('#mySelect').val();
		$('#mapcard').pushpin({ top: $('#mapcard').offset().top });
	};
	$scope.load();

	$scope.reqBackground = function(type) {
		return requestColor.getColor(type);
	};

	$scope.requests = [];
	$scope.allAccepts = [];

	$scope.seeUser = function(user){
		profileViewer.seeUser(user);
	};

	$scope.seeUserM = function(user){
		$('#modal1').closeModal();
		$scope.seeUser(user);
	};

	$scope.getRequests = function(reqtype) {
		$scope.lastCollepsed = -1;
		if (reqtype == undefined) {
			reqtype = ".*";
		}

		var sender_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/get_request/' + reqtype + '/' + sender_id)
			.success(function(data) {
				
				var id = 0;
				angular.forEach($scope.requests,function(value, key){
					var e = document.getElementById("request"+id);
					e.parentNode.removeChild(e);
					id += 1;
				});
				$scope.requests.length = 0;
				
				data.sort(function(a,b) {return (a.type < b.type) ? 1 : (
												(b.type < a.type) ? -1 : (
													(a._id < b._id) ? 1 : (
														(a._id > b._id) ? -1 : 0 ) )
												);
										} ); 				
				
				angular.forEach(data, function(value, key) {
					if(value.type != "Pending"){										
						loadUser.getUser(value.messenger_id).then(function(result){
	   						value.messenger = result;	   						
	   					});
					}else{
						$scope.getAllAccept(value._id).then(function(result){
							value.acceptNum = result.length;
							value.acceptAll = result;														
						});
					}	
					value.pimg = requestParcelImg.getByIndex(value.img);
					$scope.requests.push(value);
				});		
			})
			.error(function(data) {
				console.log(data);
			});
	};

	$scope.getRequests();

	$scope.showRemoveModal = function(index){
		$scope.curRequest = $scope.requests[index];	
        $('#removeModal').openModal();    
	};

	$scope.removeRequest = function() {		
		$http.post('/api/request/remove', $scope.curRequest)
		.success(function(data) {

			window.location.reload();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

	requestEditor.seeReq(null);

	$scope.map = {
		center: [
			13.738432,
			100.530925
		],
		zoom: 12,
		zoomToIncludeMarkers: false
	};

	$scope.markers = [];

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

	// TODO still be suck function use inteads of checking if collapse right now, 555
	$scope.showInMap = function(index) {			
		$scope.map.zoomToIncludeMarkers = 'auto';		

		$scope.markers = [];
		if (index != $scope.lastCollepsed) {
			$scope.trackable = ($scope.requests[index].type=='Inprogress'||$scope.requests[index].type=='Finished');			
			if($scope.trackable){								
				$http.get('/api/tracking/' + $scope.requests[index]._id)
					.then(function(data) {						
						$scope.path = [];
						$scope.tracking = [];						
						$scope.trackers = [];
						var dot;				
						for (var i = 0; i < data.data.length; i++) {
							var loc = data.data[i].location.split(',');
							dot = [Number(loc[0]), Number(loc[1])];						
							$scope.path.push(dot);
							$scope.tracking.push(data.data[i].date);
							var ico = 'images/tracking_icon.png';
							var scale = [10,10];
							var anchor = [5,6.5];
							if(i==data.data.length-1){
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
						$scope.updateMarkers(index);
					});
			}else{
				$scope.updateMarkers(index);
			};		

			$scope.lastCollepsed = index;
		}
		else {			
			$scope.path = [];

			$scope.lastCollepsed = -1;
			$scope.map.center = [13.738432, 100.530925];
			$scope.map.zoom = 12;
			$scope.map.zoomToIncludeMarkers = false;			
		}
	};
	$scope.lastCollepsed = -1;

	$scope.calculateCenter = function(var1, var2) {
		return (parseFloat(var1) + parseFloat(var2)) / 2;
	};

	$scope.calculateZoom = function(pos1,pos2){
		var dis = Math.sqrt(Math.pow((pos1[0]-pos2[0]),2)+Math.pow((pos1[1]-pos2[1]),2))*1000000;
		var n = 1;
		for(var i= dis; i>564.24861; i/=2, n++){}
		return 20-n;
		
	};

	$scope.openModal = function(index){	
    	$scope.curRequest = $scope.requests[index];	
        
        $('#modal1').openModal();        
        
        var id = 0;        
		angular.forEach($scope.allAccepts,function(value, key){
			var e = document.getElementById("accept"+id);			
			e.parentNode.removeChild(e);
			id += 1;
		});
		$scope.allAccepts.length = 0;

        var allAccepts = $scope.requests[index].acceptAll;
        allAccepts.sort(function(a,b) {
        	aa = a.date.split("/");
        	bb = b.date.split("/");        	
    		return (aa[2] > bb[2]) ? 1 : ((bb[2] > aa[2]) ? -1 : (
    			(aa[1] > bb[1]) ? 1 : ((bb[1] > aa[1]) ? -1 : (
    			(aa[0] > bb[0]) ? 1 : ((bb[0] > aa[0]) ? -1 : 0)))))
    	});
    	for (var i = 0; i < allAccepts.length; i++) {
	    	allAccepts[i].sort = i;	    		
   			$scope.getAcceptMessenger(allAccepts[i]);
    	}    	
    };

    $scope.getAcceptMessenger = function(accept){
    	loadUser.getUser(accept.messenger_id).then(function(data){
    		var sort = accept.sort;
			var _id = accept._id;
    		var messenger_id = accept.messenger_id;
    		var date = accept.date;
    		var hour = accept.hour;
    		var min = accept.min;
			var firstname = data.firstname;
			var lastname = data.lastname;
			var email = data.email;
			$scope.allAccepts.push({
				sort: sort,
				_id: _id,
				messenger_id: messenger_id,
				date: date,
				hour: hour,
				min: min,
				firstname: firstname,
				lastname: lastname,
				email: email
			});			
    	});    		
    }

    $scope.getAllAccept = function(request_id){
    	return $http.get('/api/acceptance/getbyreq/' + request_id)
			.then(function(data) {		
				return data.data;
			});
    };

    $scope.confirmMessenger = function(index){
    	var accept = $scope.allAccepts[index];
    	var request_id = $scope.curRequest._id;
    	$http.post('/api/request/reserve/'+request_id, accept)
			.success(function(data) {
				window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    };

    $scope.showSendingToken = function(index){
    	var e = document.getElementById("send"+index);
    	e.disabled = true;
    	var req = $scope.requests[index];
		e.innerHTML = ""+req.sender_id.substring(req.sender_id.length-2)+req._id.substring(req._id.length-2);
    };

    $scope.editRequest = function(index){
    	var ureq = $scope.requests[index];
    	requestEditor.seeReq(ureq);
    	$location.path('/newrequest');
    };

    $scope.showCancelModal = function(index){
    	$scope.curRequest = $scope.requests[index];	
        $('#cancelModal').openModal();    
    };

    $scope.cancelRequest = function(){
    	var request_id = $scope.curRequest._id;    	
    	$http.post('/api/request/cancel/'+request_id)
			.success(function(data) {
				window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
    };

    $scope.showwindow = function(event,index){
    	var d = new Date($scope.tracking[index]);
    	$scope.date = d.getDate()+"/"+(d.getMonth()+1)+"/"+d.getFullYear()
    	$scope.time = d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();   	  
    	$scope.rmap.showInfoWindow('bar',this);    
    }

}]);
