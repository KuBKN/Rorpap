app.controller('SignUpController', ['$scope', function($scope) {
    $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    $scope.upload = function(){
        var f = $document.getElementById('file').files[0],
            r = new FileReader();
        r.onloadend = function (e) {
            var data = e.target.result;
        };
        r.readAsBinaryString(f);
    };
}]);
