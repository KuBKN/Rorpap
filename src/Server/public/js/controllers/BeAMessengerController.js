app.controller('BeAMessengerController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {

    $scope.loadModal = function() {
        $('.modal-trigger').leanModal({
            dismissible: true, // Modal can be dismissed by clicking outside of the modal
            opacity: .5, // Opacity of modal background
            in_duration: 300, // Transition in duration
            out_duration: 200 // Transition out duration
        });
	};
	$scope.loadModal();

    $scope.user = {};
    $scope._id = $cookies.get('_id');
    if ($scope._id != undefined) {
        $scope._id = $cookies.get('_id').replace(/\"/g,'');
    }


    $scope.load = function() {
        $http.get('/api/user/' + $scope._id)
			.success(function(data) {
				$scope.user = data[0];
                console.log(data);
			})
			.error(function(data) {
				console.log(data);
			});
    }
    $scope.load();

}]);
