app.controller('FooterController',['$scope',function($scope){
	$scope.columns = [
	{
		title: 'Contact',
		lines: [
		{	topic: '086-977-8842'},
		{	topic: '084-932-0899'}
		]
	},
	{
		title: 'Community',
		lines: [
		{	topic: 'Pramool'},
		{	topic: 'Pantip'}
		]
	}
	]
}]);