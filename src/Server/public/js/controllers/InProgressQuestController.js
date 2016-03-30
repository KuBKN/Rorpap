app.controller('InProgressQuestController', ['$scope', '$http','$cookies', 'profileViewer', 'loadUser', 'requestColor', function( $scope, $http, $cookies, profileViewer, loadUser, requestColor, uiGmapGoogleMapApi){

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

	$scope.getRequests = function(reqtype) {
		$scope.requests = [];
		var messenger_id = $cookies.get('_id').replace(/\"/g, "");		
		reqtype = "Reserved";		
		$http.get('/api/request/get_quest/' + reqtype + '/' + messenger_id)
			.success(function(data) {			

				angular.forEach(data, function(value, key) {
					loadUser.getUser(value.sender_id).then(function(result){
   						value.sender = result;
   					});
					$scope.requests.push(value);					
				});

			})
			.error(function(data) {
				console.log(data);
			});

		reqtype = "Inprogress";		
		$http.get('/api/request/get_quest/' + reqtype + '/' + messenger_id)
			.success(function(data) {			

				angular.forEach(data, function(value, key) {
					loadUser.getUser(value.sender_id).then(function(result){
   						value.sender = result;
   					});
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

	$scope.finishRequest = function(index) {
		$http.post('/api/request/finish', $scope.requests[index])
		.success(function(data) {
			window.location.reload();
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};

    $scope.submitSendingToken = function(){
    	var req = $scope.requests[$scope.rindex];
    	var rtoken = ""+req.sender_id.substring(req.sender_id.length-2)+req._id.substring(req._id.length-2);

    	var messenger_id = req.messenger_id;
    	var user = $cookies.get('_id').replace(/\"/g, "");

    	if(rtoken == $scope.sendingToken && messenger_id == user){    		    		
	    	var request_id = req._id;
	    	$http.post('/api/request/accept/'+messenger_id+'/'+request_id)
				.success(function(data) {
					window.location.reload();
				})
				.error(function(data) {
					console.log(data);
				});
    	};
	};

	$scope.submitFinishToken = function(){
		console.log("Send");
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

}]);
