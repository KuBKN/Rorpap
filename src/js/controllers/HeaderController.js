app.controller('HeaderController',['$scope','loginService',function($scope,loginService){

	$scope.logIned = loginService.status;
	$scope.orderBy = 'order';

	$scope.menus = [
	{
		order: 1,
		name: 'My Request',
		link: '#/My Request',
		depLog: true,
		reqLog: true,
		useModal: false
	},{
		order: 2,
		name: 'Notification',
		link: '#/Notification',
		depLog: true,
		reqLog: true,
		useModal: false
	},{
		order: 3,
		name: 'About',
		link: '#/About',
		depLog: false,
		reqLog: false,
		useModal: false
	},{
		order: 4,
		name: 'Sign Up',
		link: 'javascript:void(0)',
		depLog: true,
		reqLog: false,
		useModal: true,
		modal: 'modalSignup'
	},{
		order: 5,
		name: 'Log In',
		link: 'javascript:void(0)',
		depLog: true,
		reqLog: false,
		useModal: true,
		modal: 'modalLogin'
	},
	{
		order: 6,
		name: 'Profile',
		link: '#/Profile',
		depLog: true,
		reqLog: true,
		useModal: false
	}];

}]);