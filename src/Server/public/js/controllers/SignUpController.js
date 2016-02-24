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

    $scope.check = function(val, val2) {
        if (val) {
          if (val2) {
            $scope.signUp();
          }else{
            alert('Password is missmatch');
          }
        }else{
            alert('Please accept our policy');
        }
    }

    $scope.signUp = function() {
      var dateOfBirth_temp = $scope.user.dateOfBirth;
      $scope.user.dateOfBirth = $scope.user.dateOfBirth_in.toString().substring(0, 15);

      $scope.user.password = CryptoJS.MD5($scope.user.password1).toString();

      $http.post('/api/user/create', $scope.user)
      .success(function(data) {
        console.log('Log in success');

        window.location.reload();
      })
      .error(function(data) {
        $scope.user.dateOfBirth = dateOfBirth_temp;
        console.log('Error: ' + data);
      });

    };

}]);
