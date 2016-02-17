app.controller('SignUpController', ['$scope', '$http','$window', function($scope, $http, $window) {

    $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    $scope.user = {};

    $scope.upload = function() {
        var f = $document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function (e) {
            var data = e.target.result;
        };
        r.readAsBinaryString(f);
    };

    $scope.check = function(val) {
        if (val) {
            $scope.signUp();
        }
        else{
            alert('Please accept our policy');
        }
    }

    $scope.signUp = function() {
      var dateOfBirth_temp = $scope.user.dateOfBirth;
      $scope.user.dateOfBirth = $scope.user.dateOfBirth.toString().substring(0, 15);

      var password_temp = $scope.user.password;
      $scope.user.password = CryptoJS.MD5($scope.user.password).toString();

      $http.post('/api/user/create', $scope.user)
      .success(function(data) {
        // $scope.user = {};

        window.location.reload();
      })
      .error(function(data) {
        $scope.user.password = password_temp;
        $scope.user.dateOfBirth = dateOfBirth_temp;

        console.log('Error: ' + data);
      });

    };

}]);
