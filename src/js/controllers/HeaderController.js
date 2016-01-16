app.controller('HeaderController',['$scope',function($scope){
	$scope.menus = [
	{
		name: 'About',
		link: 'views/about.html'
	},{
		name: 'Sign Up',
		link: 'views/signUp.html'
	},{
		name: 'Log In',
		link: '/'
	}
	];
}]);

