app.controller('HeaderController',['$scope',function($scope){
	$scope.menus = [
	{
		name: 'About',
		link: '#/About'
	},{
		name: 'Sign Up',
		link: '#/Sign Up'
	},{
		name: 'Log In',
		link: '/'
	}
	]
}]);