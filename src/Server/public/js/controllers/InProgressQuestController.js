app.controller('InProgressQuestController', ['$scope', '$http','$cookies', 'profileViewer', 'loadUser', 'requestColor', 'requestParcelImg', 'mailMessage', function( $scope, $http, $cookies, profileViewer, loadUser, requestColor, requestParcelImg, mailMessage, uiGmapGoogleMapApi){

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
		});

	};
	$scope.load();

	$scope.reqBackground = function(type) {
		return requestColor.getColor(type);
	};

	$scope.seeUser = function(user){
		profileViewer.seeUser(user);
	};

	$scope.requests = [];

	$scope.getRequests = function() {
		$scope.requests = [];
		var messenger_id = $cookies.get('_id').replace(/\"/g, "");
		var reqtype = "Reserved";
		$http.get('/api/request/get_quest/' + reqtype + '/' + messenger_id)
			.success(function(data) {
				data.sort(function(a,b) {return (a._id < b._id) ? 1 : (
														(a._id > b._id) ? -1 : 0);
				});

				angular.forEach(data, function(value, key) {
					loadUser.getUser(value.sender_id).then(function(result){
   						value.sender = result;
   					});
   					value.pimg = requestParcelImg.getByIndex(value.img);
					$scope.requests.push(value);
				});

			})
			.error(function(data) {
				console.log(data);
			});

		reqtype = "Inprogress";
		$http.get('/api/request/get_quest/' + reqtype + '/' + messenger_id)
			.success(function(data) {

				data.sort(function(a,b) {return (a._id < b._id) ? 1 : (
														(a._id > b._id) ? -1 : 0);
				});
				angular.forEach(data, function(value, key) {
					loadUser.getUser(value.sender_id).then(function(result){
   						value.sender = result;
   					});
   					value.pimg = requestParcelImg.getByIndex(value.img);
					$scope.requests.push(value);
				});

			})
			.error(function(data) {
				console.log(data);
			});
	};

	$scope.getRequests();

	$scope.rindex;

	$scope.typeSendingToken = function(index){
		$('#modalTSendingToken').openModal();
		$scope.rindex = index;
	};

	$scope.typeFinishToken = function(index){
		$('#modalTFinishToken').openModal();
		$scope.rindex = index;
	};

    $scope.submitSendingToken = function(){
    	var req = $scope.requests[$scope.rindex];
    	var rtoken = ""+req.sender_id.substring(req.sender_id.length-2)+req._id.substring(req._id.length-2);

    	var messenger_id = req.messenger_id;
    	var user = $cookies.get('_id').replace(/\"/g, "");

    	if(rtoken == $scope.sendingToken && messenger_id == user){
	    	var request_id = req._id;
	    	var message = mailMessage.getMessage('sendTokenToRec',req);
	    	console.log(message);
	    	$http.post('/api/mailservice/',message)
				.success(function(data) {

				})
				.error(function(data) {
					console.log(data);
				});
	    	$http.post('/api/request/accept/'+messenger_id+'/'+request_id)
				.success(function(data) {
					window.location.reload();
				})
				.error(function(data) {
					console.log(data);
				});
    	}else{
    		alert('Wrong token');
    		$('#modalTSendingToken').closeModal();
    	}
	};

	$scope.submitFinishToken = function(){
		console.log($scope.finishToken);
    	var req = $scope.requests[$scope.rindex];

    	if($scope.finishToken == "Send"){
	    	var request_id = req._id;
	    	$http.post('/api/request/finish', req)
				.success(function(data) {
					window.location.reload();
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
    	};
	};

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

		$scope.trackable = ($scope.requests[index].type=='Inprogress'||$scope.requests[index].type=='Finished');
		if($scope.trackable){
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

	 $scope.showCancelModal = function(index){
    	$scope.curRequest = $scope.requests[index];	
        $('#cancelModal').openModal();    
    };

	$scope.cancelReserved = function(){
		var request_id = $scope.curRequest._id;		
    	$http.post('/api/request/cancel/'+request_id)
			.success(function(data) {
				window.location.reload();
			})
			.error(function(data) {
				console.log(data);
			});
	};

}]);
