app.directive('loginModal', function() {
  return {
  	restrict: 'E',
    templateUrl: 'js/directives/loginModal.html'
  };
});

app.directive('signupModal', function() {
  return {
  	restrict: 'E',
    templateUrl: 'js/directives/signupModal.html'
  };
});

app.directive('logoutModal', function() {
  return {
  	restrict: 'E',
    templateUrl: 'js/directives/logoutModal.html'
  };
});
