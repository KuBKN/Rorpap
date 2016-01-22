app.controller('MyRequestController',['$scope',function($scope){

	$scope.load = function(){
		$('.collapsible').collapsible({
        accordion : false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
	};

	$scope.load();

}]);