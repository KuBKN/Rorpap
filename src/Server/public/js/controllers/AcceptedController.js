app.controller('AcceptedController', ['$scope', '$http','$cookies', 'profileViewer', 'loadUser', 'requestColor', 'requestParcelImg', function( $scope, $http, $cookies, profileViewer, loadUser, requestColor, requestParcelImg, uiGmapGoogleMapApi){

	$scope.load = function() {
		$('.collapsible').collapsible({
			accordion : false
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

	$scope.requests = [];

	$scope.getRequests = function(reqtype) {
		$scope.requests = [];
		reqtype = "Pending";
		var sender_id = $cookies.get('_id').replace(/\"/g, "");

		$http.get('/api/request/get_request/' + reqtype + '/!' + sender_id)
			.success(function(data) {
				$scope.accepts = [];
				$scope.acceptsR = [];
				$scope.getAllAccept().then(function(result){
					 angular.forEach(result, function(value,key){
					 	$scope.accepts.push(value);
					 	$scope.acceptsR.push(value.request_id);
					 });
					 data.sort(function(a,b) {return (a._id < b._id) ? 1 : (
														(a._id > b._id) ? -1 : 0 )
										} );
					 angular.forEach(data, function(value, key) {
					 	var indexA = $scope.acceptsR.indexOf(value._id);
						if(indexA != -1){
							loadUser.getUser(value.sender_id).then(function(result){
		   						value.sender = result;
		   					});
		   					value.accepto = $scope.accepts[indexA];
		   					value.pimg = requestParcelImg.getByIndex(value.img);
							$scope.requests.push(value);
						}
					});
				});
			})
			.error(function(data) {
				console.log(data);
			});
	};

	$scope.getRequests();

	$scope.getAllAccept = function(){
		var messenger_id = $cookies.get('_id').replace(/\"/g, "");
    	return $http.get('/api/acceptance/getbymess/' + messenger_id)
			.then(function(data) {
				return data.data;
			});
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
					console.log(data);
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

	$scope.removeAccept = function(index) {
		$http.post('/api/acceptance/remove', $scope.requests[index].accepto)
				.success(function(data) {
					window.location.reload();
				})
				.error(function(data) {
					console.log(data);
				});
	};

	$scope.accept = {};

	$scope.openModal = function(index){
		$('#modalAccept').openModal();
		$scope.curAccept = $scope.requests[index].accepto;
		console.log($scope.curAccept);
	};

	$scope.editTime = function(){
		var date_t = $scope.accept.date_t;
		$scope.accept.date = date_t.getDate()+"/"+(date_t.getMonth()+1)+"/"+date_t.getFullYear();
		var id = $scope.curAccept._id;
		$http.post('/api/acceptance/edit/'+id, $scope.accept)
				.success(function(data) {
					window.location.reload();					
				})
				.error(function(data) {
					console.log(data);
				});
	};



}]);
