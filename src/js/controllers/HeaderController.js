app.controller('HeaderController',['$scope','$uibModal','$log',function($scope,$uibModal,$log){

	$scope.menus = [
	{
		name: 'Log In',
		link: 'javascript:void(0)',
		modal: function(){
			var modalInst = $uibModal.open({
				animation: true,
				templateUrl: './views/logIn.html',
				size: 'sm'
			});
		}
	},{
		name: 'Sign Up',
		link: 'javascript:void(0)',
		modal: function(){
			var modalInst = $uibModal.open({
				animation: true,
				templateUrl: './views/signUp.html'
			});
		}
	},{
		name: 'About',
		link: '#/About',
		modal: function(){}
	}];

}]);