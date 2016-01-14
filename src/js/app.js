var app = angular.module("rorpap", ['ngRoute']);
app.config(function($routeProvider) {
  $routeProvider.when('/', {
    controller: 'HomeController',
    templateUrl: 'home.html'
  }).when('/about', {
    controller: 'AboutController',
    templateUrl: 'about.html'
  }).otherwise({
    redirectTo: '/'
  });
});
