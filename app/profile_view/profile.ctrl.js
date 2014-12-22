'use strict'

var myApp = angular.module('myApp.view.profile', []);

myApp.controller('ProfileCtrl', ['$scope', '$http', '$timeout', '$location', '$mdDialog', '$mdToast', 'shareData', function($scope, $http, $timeout, $location, $mdDialog, $mdToast, shareData) {	
	$scope.shareData = shareData;		
	$scope.user = {email: shareData.email, password: "", confim_password: ""};	
	$scope.user.email = $scope.user.email ? $scope.user.email : "";
	$scope.editable = false;
	$scope.userChange = false;

	$scope.enableEdit = function(){
		$scope.editable = true;		
	};
	$scope.notifyChange = function(){		
		$scope.userChange = true;
	}
	$scope.signout = function(){
		delete shareData.email;
		$location.path('login');
		$mdDialog.hide();
	}
	$scope.updateAccount = function(){		
		$scope.userChange = false;	
		$scope.editable = false;

		$http.post('api/user/'+$scope.user.email, {email: $scope.user.email, password: $scope.user.password})
		.success(function(data, status, headers, config){
			if (status == 200){
				$mdToast.show($mdToast.simple().content('Update change successfully.'));
			}
		})
		.error(function(data, status, headers, config){
			if (status == 404){				
				$mdToast.show($mdToast.simple().content('!!! Problem happened. Please try again later.'));
			}
		});
	}
}]);