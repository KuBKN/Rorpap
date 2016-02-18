app.controller('MyQuestController', ['$scope','$timeout', function($scope,$timeout) {

	$scope.load = function() {
		$(document).ready(function(){

			$('#page_tabs').tabs({
				// activate : function(event,ui) {
		  //           console.log("activated a tab");
		  //       }

			});
			
		});
		
	};
	$scope.load();

	$scope.reRednerMap = function() {

      $timeout(function(){
         angular.forEach($scope.maps, function(index) {
            google.maps.event.trigger(index, 'resize');
          });
      }, 100);
    }
    $scope.maps = [];
    $scope.$on('mapInitialized', function(evt, evtMap) {
          $scope.maps.push(evtMap);
    });

}]);
