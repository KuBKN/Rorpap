app.controller('ProfileOtherController', ['$scope', 'profileViewer', '$cookies', '$http', function($scope, profileViewer, $cookies, $http){

	$scope.user = profileViewer.getUser();

	$scope.doclink = {};
	$scope.doclink.hidden = true;

	$scope.doc = {};
	$scope.doc.filename = "";

	$scope.loadDoc = function() {
        var user_id = $scope.user._id;
        $http.post('/api/file/get', {
            user_id: user_id,
            type: 1
        })
        .success(function(data) {
            console.log(data.filename);
            if (data.filename == undefined) {

            }
            else {
                $scope.doclink.hidden = false;
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
