app.controller('MyRequestController', ['$scope', '$http', '$cookies', '$location', 'loadUser', 'profileViewer', 'requestColor', 'requestParcelImg', 'requestEditor', function($scope, $http, $cookies, $location, loadUser, profileViewer, requestColor, requestParcelImg, requestEditor) {

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});
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
					value.smallPsize = requestParcelImg.getNameByIndex(value.psize.substring(value.psize.length-5,value.psize.length-4));
					$scope.requests.push(value);
				});		
			})
			.error(function(data) {
				console.log(data);
			});
	};

	$scope.getRequests();

	$scope.removeRequest = function(index) {
		$http.post('/api/request/remove', $scope.requests[index])
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
		zoom: 12
	};

	$scope.marker_from = {};
	$scope.marker_to = {};

	// TODO still be suck function use inteads of checking if collapse right now, 555
	$scope.showInMap = function(index) {
		console.log($scope.requests[index]);
		$scope.marker_from = {};
		$scope.marker_to = {};
		$scope.map.zoom = 10;
		$scope.path = [];

		if (index != $scope.lastCollepsed) {
			var loc = $scope.requests[index].fromLoc.split(', ');
			$scope.marker_from.position = [loc[0],loc[1]];
			$scope.marker_from.optimized = true;
			$scope.marker_from.icon = {
						        url:'images/LOGO-RED.png',
						        scaledSize:[40,40]
						      };

		    var loc = $scope.requests[index].toLoc.split(', ');
			$scope.marker_to.position = [loc[0],loc[1]];
			$scope.marker_to.optimized = false;
			$scope.marker_to.icon = {
						        url:'images/LOGO-GREEN.png',
						        scaledSize:[40,40]
						      };

			$scope.map.center= [ $scope.calculateCenter($scope.marker_from.position[0], $scope.marker_to.position[0])
								, $scope.calculateCenter($scope.marker_from.position[1], $scope.marker_to.position[1])];

			$scope.marker_from.visible = true;
			$scope.marker_to.visible = true;
			var f = document.getElementById("marker_f");
			// console.log(f);
			google.maps.event.addListener(f, 'click', function() {			
	            console.log("this is marker");
	        });
			// $scope.map.addListener("mouseover",function(){
			//  	console.log('nop');
			// });

			$scope.map.zoom = $scope.calculateZoom($scope.marker_from.position,$scope.marker_to.position);

			$scope.lastCollepsed = index;
		}
		else {
			$scope.marker_from = {};
			$scope.marker_to = {};
			$scope.path = [];

			$scope.lastCollepsed = -1;
			$scope.marker_from.visible = false;
			$scope.marker_to.visible = false;
			$scope.map.center=[13.738432,100.530925];
		}

		$http.get('/api/tracking/' + $scope.requests[index]._id)
			.success(function(data) {

				$scope.path = [];
				for (var i = 0; i < data.length; i++) {
					var loc = data[i].location.split(',');
					var dot = [Number(loc[0]), Number(loc[1])];

					$scope.path.push(dot);
				}

			})
			.error(function(data) {
				console.log(data);
			});
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
        
        $('#modal1').openModal();        
        
        var id = 0;        
		angular.forEach($scope.allAccepts,function(value, key){
			var e = document.getElementById("accept"+id);			
			e.parentNode.removeChild(e);
			id += 1;
		});
		$scope.allAccepts.length = 0;

        var allAccepts = $scope.requests[index].acceptAll;
    	for (var i = 0; i < allAccepts.length; i++) {	    		
   			$scope.getAcceptMessenger(allAccepts[i]);
    	}      
    };

    $scope.getAcceptMessenger = function(accept){
    	loadUser.getUser(accept.messenger_id).then(function(data){
			var _id = accept._id;
    		var messenger_id = accept.messenger_id;
			var firstname = data.firstname;
			var lastname = data.lastname;
			var email = data.email;
			$scope.allAccepts.push({
				_id: _id,
				messenger_id: messenger_id,
				firstname: firstname,
				lastname: lastname,
				email: email
			});  						
    	});    		
    }

    $scope.getAllAccept = function(request_id){
    	$scope.curRequest = request_id;
    	return $http.get('/api/acceptance/' + request_id)
			.then(function(data) {		
				return data.data;
			});
    };

    $scope.confirmMessenger = function(messenger){
    	var messenger_id = $scope.allAccepts[messenger].messenger_id;
    	var request_id = $scope.curRequest;
    	$http.post('/api/request/reserve/'+messenger_id+'/'+request_id)
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
    	requestEditor.seeReq($scope.requests[index]);
    	$location.path('/newrequest');
    };

}]);
