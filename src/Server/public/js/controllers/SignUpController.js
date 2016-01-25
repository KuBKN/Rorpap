app.controller('SignUpController', ['$scope', '$http','$window', function($scope,$http,$window) {
    $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    $scope.user = {};

    $scope.upload = function(){
        var f = $document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function (e) {
            var data = e.target.result;
        };
        r.readAsBinaryString(f);
    };

    $scope.signUp = function() {
        $scope.user.password = CryptoJS.MD5($scope.user.password).toString();
        $http.post('/api/user', $scope.user)
			.success(function(data) {
				$scope.user = {};

                $window.location.reload();
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    }
}]);
