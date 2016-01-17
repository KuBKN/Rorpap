app.controller('HeaderController',['$scope','$uibModal','$log','loginService',function($scope,$uibModal,$log,loginService){

	$scope.logIned = loginService.status;
	$scope.orderBy = 'order';

	$scope.menus = [
	{
		order: 1,
		name: 'My Request',
		link: '#/My Request',
		fontSize: 3,
		depLog: true,
		reqLog: true,
		modal: function(){}
	},{
		order: 2,
		name: 'Notification',
		link: '#/Notification',
		fontSize: 3,
		depLog: true,
		reqLog: true,
		modal: function(){}
	},{
		order: 3,
		name: 'About',
		link: '#/About',
		fontSize: 5,
		depLog: false,
		reqLog: false,
		modal: function(){}
	},{
		order: 4,
		name: 'Sign Up',
		link: 'javascript:void(0)',
		fontSize: 5,
		depLog: true,
		reqLog: false,
		modal: function(){
			var modalInst = $uibModal.open({
				animation: true,
				templateUrl: './views/signUp.html'
			});
		}
	},{
		order: 5,
		name: 'Log In',
		link: 'javascript:void(0)',
		fontSize: 5,
		depLog: true,
		reqLog: false,
		modal: function(){
			var modalInst = $uibModal.open({
				animation: true,
				templateUrl: './views/logIn.html',
				controller: 'LogInController',
				size: 'sm',
			});
		}
	},
	{
		order: 6,
		name: 'Profile',
		link: '#/Profile',
		fontSize: 5,
		depLog: true,
		reqLog: true,
		modal: function(){}
	}];

}]);