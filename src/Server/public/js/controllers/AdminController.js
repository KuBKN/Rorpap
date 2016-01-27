app.controller('AdminController', ['$scope', '$http', '$window', function($scope,$http,$window) {

    $scope.upload = function(){
        var f = $document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function (e) {
            var data = e.target.result;
        };
        r.readAsBinaryString(f);
    };

    $scope.check = function(val){
        if (val) { $scope.signUp(); }
        else{ alert('Please accept our policy')}
    }

    $scope.signUp = function() {

        $scope.user.password = CryptoJS.MD5($scope.user.password).toString();
        $http.post('/api/user', $scope.user)
			.success(function(data) {
				$scope.user = {};

                window.location.reload();
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    };

}]);
