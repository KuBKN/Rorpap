var app = angular.module('rorpap');

app.controller('UploadFileController', ['$scope', 'Upload', '$timeout', function($scope, Upload, $timeout){
    $scope.uploadPic = function(file) {
        file.upload = Upload.upload({
            url: '/service/upload',
            data: {file: file, username: $scope.username},
        });

        file.upload.then(function (response) {
            $timeout(function () {
                file.result = response.data;
            });
        }, function (response) {
            if (response.status > 0)
                $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
            // Math.min is to fix IE which reports 200% sometimes
            file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
    };
}]);