'use strict'

var myApp = angular.module('myApp.view.terminal', ['ngRoute']);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/terminal', {
    templateUrl: 'terminal_view/terminal_view.html',
    controller: 'TerminalCtrl'
  });
}]);

myApp.controller('TerminalCtrl', ['$scope', '$http', '$timeout', '$location', '$mdDialog', '$mdToast', 'shareData', function($scope, $http, $timeout, $location, $mdDialog, $mdToast, shareData) {	
	$scope.shareData = shareData;		
	$scope.tabs = ['html', 'css', 'js'];
	$scope.data = {htmlModel: "", jsModel: "", cssModel: ""};			
	$scope.sectionSelected = 'content';
	$scope.tabs = [{name: 'html'}, {name: 'css'}, {name: 'js'}];

	$scope.navBack = function(){		
		$location.path('main');
	};
	$scope.runScript = function(){
		var selekon = "<html><head>\
		  <meta http-equiv=\"content-type\" content=\"text/html; charset=UTF-8\">\
		  <title>Newell demo</title>\
		  <style type=\"text/css\">"+$scope.data.cssModel
		  +"</style><script type=\"text/javascript\">//<![CDATA[\n" + $scope.data.jsModel 
			+"//]]></script></head><body>"+$scope.data.htmlModel+"</body></html>";

			var iframeDocument = document.querySelector('#frameResult').contentWindow.document;
			var content = selekon;
			iframeDocument.open('text/html', 'replace');
			iframeDocument.write(content);
			iframeDocument.close();
	}
	// $scope.user = {email: shareData.email, password: "", confim_password: ""};	
	// $scope.user.email = $scope.user.email ? $scope.user.email : "";
	// $scope.editable = false;
	// $scope.userChange = false;

	// $scope.enableEdit = function(){
	// 	$scope.editable = true;		
	// };
	// $scope.notifyChange = function(){		
	// 	$scope.userChange = true;
	// }
	// $scope.signout = function(){
	// 	delete shareData.email;
	// 	$location.path('login');
	// 	$mdDialog.hide();
	// }
	// $scope.updateAccount = function(){		
	// 	$scope.userChange = false;	
	// 	$scope.editable = false;

	// 	$http.post('api/user/'+$scope.user.email, {email: $scope.user.email, password: $scope.user.password})
	// 	.success(function(data, status, headers, config){
	// 		if (status == 200){
	// 			$mdToast.show($mdToast.simple().content('Update change successfully.'));
	// 		}
	// 	})
	// 	.error(function(data, status, headers, config){
	// 		if (status == 404){				
	// 			$mdToast.show($mdToast.simple().content('!!! Problem happened. Please try again later.'));
	// 		}
	// 	});
	// }
}]);