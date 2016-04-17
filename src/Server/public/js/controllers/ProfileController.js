app.controller('ProfileController', ['$scope', '$http', '$window', 'loadUser', 'Upload', '$cookies', function($scope, $http, $window, loadUser, Upload, $cookies) {

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









    $scope.upload = function() {
        console.log($scope.file);
      if ($scope.form.file.$valid && $scope.file) {
        $scope.uploadFile($scope.file);
      }
    };

    $scope.uploadFile = function (file) {
        Upload.upload({
            url: '/api/file/upload',
            data: {
                file: file
            }
        }).then(function (resp) {
            // console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            $scope.doc.hidden = false;
            $scope.doc.filename = "uploads/" + resp.data;
            $scope.doc.uploaded = true;
        }, function (resp) {
            // console.log('Error status: ' + resp.status);
        }, function (evt) {
            // var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            // console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
        });
    };

    $scope.save = function() {
        $http.post('/api/file/save', {
            user_id: $scope.user._id,
            filename: $scope.doc.filename,
            type: 1
        })
        .success(function(data) {
            $window.location.reload();
        })
        .error(function(err) {
            console.log(err);
        });
    }

    $scope.doc = {};
    $scope.doc.hidden = true;
    $scope.doc.filename = "";
    $scope.doc.provedDate = "";
    $scope.doc.uploaded = false;

    $scope.loadDoc = function() {
        var user_id = $cookies.get('_id').replace(/\"/g, '');
        $http.post('/api/file/get', {
            user_id: user_id,
            type: 1
        })
        .success(function(data) {
            console.log(data.filename);
            if (data.filename == undefined) {

            }
            else {
                $scope.doc.hidden = false;
                $scope.doc.filename = data.filename;
                $scope.doc.provedDate = data.provedDate;
            }
        })
        .error(function(err) {
            console.log(err);
        });
    };
    $scope.loadDoc();

}]);
