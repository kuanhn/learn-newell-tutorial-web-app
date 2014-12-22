'use strict';

var app = angular.module('myApp.view.login', ['ngRoute', 'ngMaterial']);
app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/login', {
    templateUrl: 'login_view/login_view.html',
    controller: 'LoginCtrl'
  }).when('/forget-password', {
  	templateUrl: 'login_view/login_view.html',
    controller: 'ForgetPasswordCtrl'
  }).when('/signup', {
  	templateUrl: 'login_view/login_view.html',
    controller: 'SignUpCtrl'
  })
}]);

// login controller
app.controller('LoginCtrl', ['$scope', '$location', '$http', '$mdDialog', 'shareData', function($scope, $location, $http, $mdDialog, shareData) {
	$scope.user = {
		password: "",
		email: ""
	};
	$scope.selections = [		
		{name: "Foget password", url: "#/forget-password"},
		{name: "Create a account", url: "#/signup"}
	];
	$scope.isSelected = function(index){
		return index == 0;
	}
	$scope.signIn = function () {

		$http.post('/login', {username: $scope.user.email, password: $scope.user.password})
		.success(function(data, status, headers, config){
			var json = angular.fromJson(data);
			console.log('data:'+json);
			if (status == 200 && json.authenticated){
				shareData.email = $scope.user.email;				
				$location.path('main');
			} else if (!json.authenticated){
				$mdDialog.show(
		      $mdDialog.alert()
		        .title('Login failed')
		        .content('Your username/ password is not right. Please re-check again')
		        .ariaLabel('Password notification')
		        .ok('Got it!')			        
	      );
			}
		})
		.error(function(data, status, headers, config){			
			$mdDialog.show(
		      $mdDialog.alert()
		        .title('Something was wrong!!!')
		        .content('Something happen make your incompletely action. Please try again later.')
		        .ariaLabel('Password notification')
		        .ok('Got it!')		        
	      );
		});
	}
}]);

// forget password controller
app.controller('ForgetPasswordCtrl', ['$scope', '$timeout', '$mdDialog', function($scope, $timeout, $mdDialog) {
	$scope.user = {
		email: ""		
	};
	$scope.selections = [		
		{name: "Login", url: "#/login"},
		{name: "Create a account", url: "#/signup"}
	];
	$scope.isSelected = function(index){
		return index == 1;
	}
	$scope.confirmSentEmail = function(ev){			
		$timeout(function(){			
			$mdDialog.show(
	      $mdDialog.alert()
	        .title('In processing')
	        .content('This function is not available now.')
	        .ariaLabel('Password notification')
	        .ok('Got it!')
	        .targetEvent(ev)
	      );
		}, 1000);
	}
}]);

// sign up controller
app.controller('SignUpCtrl', ['$scope', '$mdDialog', '$http', function($scope, $mdDialog, $http) {
	$scope.user = {		
		email: "",
		connfirmPassword: "",
		password: ""
	};
	$scope.selections = [		
		{name: "Login", url: "#/login"},
		{name: "Foget password", url: "#/forget-password"}		
	];
	$scope.isSelected = function(index){
		return index == 2;
	};
	$scope.signupAccount = function(ev){		
		$http.post('api/user/', {email: $scope.user.email, password: $scope.user.password})
		.success(function(data, status, headers, config){
			if (status == 200){
				$mdDialog.show(
		      $mdDialog.alert()
		        .title('Congratulation')
		        .content('Your account was created.')
		        .ariaLabel('Account notification')
		        .ok('Got it!')
		        .targetEvent(ev)
	      );
			}
		})
		.error(function(data, status, headers, config){
			if (status == 404){
				var json = angular.fromJson(data);
				$mdDialog.show(
		      $mdDialog.alert()
		        .title('Error')
		        .content(data.error)
		        .ariaLabel('Account notification')
		        .ok('Got it!')
		        .targetEvent(ev)
	      );	
			}
		});		
	}
}]);

// app.directive('overwriteEmail', function() {
//   var EMAIL_REGEXP = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:[A-Z]{2}|com|org|net|edu|gov|mil|biz|info|mobi|name|aero|asia|jobs|museum)$/i;

//   return {
//     require: 'ngModel',
//     restrict: '',
//     link: function(scope, elm, attrs, ctrl) {
//       // only apply the validator if ngModel is present and Angular has added the email validator
//       if (ctrl && ctrl.$validators.email) {

//         // this will overwrite the default Angular email validator
//         ctrl.$validators.email = function(modelValue) {        	
//           return ctrl.$isEmpty(modelValue) || EMAIL_REGEXP.test(modelValue);
//         };        
//       }
//     }
//   };
// });



function DialogController($scope, $mdDialog) {
  $scope.hide = function() {
    $mdDialog.hide();
  };
  $scope.cancel = function() {
    $mdDialog.cancel();
  };
  $scope.answer = function(answer) {
    $mdDialog.hide(answer);
  };
}