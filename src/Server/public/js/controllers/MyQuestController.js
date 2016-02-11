app.controller('MyQuestController', ['$scope', function($scope) {

	$scope.load = function() {
		$(document).ready(function(){
			$('ul.tabs').tabs();
		});
		
	};
	$scope.load();

}]);
