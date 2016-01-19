var app = angular.module('rorpap');

app.controller('SignUpController', ['$scope', function($scope) {
    $scope.passwordPattern = /(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
}]);

/* Directive for date picker during user's Date of Birth selection */
app.directive("datepicker", function () {
    return {
        restrict: "A",
        require: "ngModel",
        link: function (scope, elem, attrs, ngModelCtrl) {
            var updateModel = function (dateText) {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(dateText);
                });
            };
            var options = {
                dateFormat: "dd/mm/yy",
                onSelect: function (dateText) {
                    updateModel(dateText);
                }
            };
            elem.datepicker(options);
        }
    }
});

/* Directive for confirming password whether both password fields are equal */
app.directive("passwordConfirmation", function(){
    var directive = {};

    directive.restrict = 'A';
    directive.require = 'ngModel';
    directive.scope = {
        original: '=passwordConfirmation'
    };
    directive.link = function (scope, elem, attrs, ctrl) {
        var firstPassword = '#' + attrs.passwordConfirmation;
        elem.add(firstPassword).on('keyup', function () {
            scope.$apply(function () {
                ctrl.$setValidity('equals', elem.val() === $(firstPassword).val());
            });
        });
    };

    return directive;
});