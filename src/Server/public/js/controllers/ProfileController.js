app.controller('ProfileController', ['$scope', '$http', '$window', 'loadUser', function($scope, $http, $window, loadUser) {

    $scope.logIned = loadUser.isLogIned();

    if( $scope.logIned ){
        var user = loadUser.getUser();
        user.then(function(result){
            $scope.user = result;
        });
    }

    $scope.enabled = function(id){
        var e = document.getElementById(id);
        e.disabled = !e.disabled;
    }

    $scope.showPassword = function(){
        document.getElementById("changePassword").style.display = "block";
    }

    var checkMatchPass= function(){
        if ($scope.user.password1 != $scope.user.password2) {
            alert('missmatch');
            return false;
        };
        return true;
    }

    $scope.update = function() {
        if(checkMatchPass()){
            if ($scope.user.password1 != "" && $scope.user.password1 != undefined)
                $scope.user.password = CryptoJS.MD5($scope.user.password1).toString();
            else {
                $scope.user.password = "";
            }

            $http.post('/api/user/update', $scope.user)
                .success(function(data) {

                    window.location.reload();
                })
                .error(function(data) {
                    console.log(data);
                });
        }
    };

    $scope.enroll = function() {
        $http.post('/api/user/enroll', {_id: $scope.user._id})
            .success(function(data) {
                window.location.reload();
            })
            .error(function(data) {
                console.log(data);
            });
    }

    $scope.sendmail = function(){
        console.log('in function');
        $http.post('/api/mailservice').success(function(data){
            console.log('success\n');
            console.log(data);
        }).error(function(){
            console.log('error');
        });
    };

}]);
