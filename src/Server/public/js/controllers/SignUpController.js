app.controller('SignUpController', ['$scope', '$http', function($scope,$http) {
    // $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

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
        $http.post('/api/user', $scope.user)
			.success(function(data) {
				$scope.user = {};

                // TODO after finish signup here
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});
    }
}]);
