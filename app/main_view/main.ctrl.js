'use strict'

var myApp = angular.module('myApp.view.main', [
	'ngRoute', 
	'myApp.view.lesson', 
	'myApp.view.note',
	'myApp.view.profile'
	]);

myApp.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/main', {
    templateUrl: 'main_view/main_view.html',
    controller: 'MainCtrl'
  });
}]);

myApp.factory('shareData', function(){
	return function(){
		var data = {};
		data.detailView = false;		
		data.selected = "";

		return data;
	};
});

myApp.controller('MainCtrl', ['$scope', '$timeout', '$location', '$mdDialog', 'shareData', function($scope, $timeout, $location, $mdDialog, shareData) {	
	$scope.data = shareData;	
	$scope.data.detailView = false;
	
	$scope.mainCategories = [];
	$scope.categories = [];
	$timeout(function(){
		$scope.mainCategories.push({id:'html', img: 'html.png'})
		$scope.mainCategories.push({id:'css', img: 'css.png'})
		$scope.mainCategories.push({id:'js', img: 'js.png'});

		$scope.categories.push({img: 'project.png', id:'project'})
		$scope.categories.push({img: 'terminal.png', id:'terminal'})
		$scope.categories.push({img: 'badge.png', id:'badge'})
		$scope.categories.push({img: 'note.png', id:'note'})
		$scope.categories.push({img: 'profile.png', id:'profile'});
	}, 500);

	$scope.selectMainCategory = function($index){
		$scope.data.detailView = true;
		$scope.data.selected = $scope.mainCategories[$index].id;
		$location.path('lesson/'+$scope.mainCategories[$index].id);
	};

	$scope.selectCategory = function($index){
		$scope.data.detailView = true;
		$scope.data.selected = $scope.categories[$index].id;
		if ($scope.categories[$index].id === 'profile'){
			$mdDialog.show({
				templateUrl: 'profile_view/profile_view.html',
				controller: 'ProfileCtrl'
			});
		} else if ($scope.categories[$index].id === 'note' || $scope.categories[$index].id === 'terminal')
			$location.path($scope.categories[$index].id);
		else {
			$mdDialog.show(
		      $mdDialog.alert()
		        .title('Coming soon')
		        .content('This feature is in developing.')
		        .ariaLabel('Notify')
		        .ok('Got it!')			        
	      );
		}
	}
}]);