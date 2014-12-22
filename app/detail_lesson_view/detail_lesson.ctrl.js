'use strict'

var app = angular.module('myApp.view.detailLesson', ['ngRoute', 'myApp.view.note']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lesson/:id/:lessonid', {
    templateUrl: 'detail_lesson_view/detail_lesson_view.html',
    controller: 'DetailLessonCtrl'
  });
}]);

app.controller('DetailLessonCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', '$mdDialog', '$mdToast', 'shareData', function($scope, $routeParams, $location, $http, $timeout, $mdDialog, $mdToast, shareData){
	$scope.shareData = shareData;
	$scope.data = {htmlModel: "", jsModel: "", cssModel: ""};
	$scope.id = $routeParams.id;
	$scope.lessonId = $routeParams.lessonid;
	$scope.shareData.id = $scope.id;
	$scope.shareData.lessonId = $scope.lessonId;
	$scope.sectionSelected = 'content';
	$scope.tabs = [{name: 'html'}, {name: 'css'}, {name: 'js'}];

	$scope.title = "";
	$scope.content = "";
	$scope.practiceContent = "";
	$timeout(function(){
		$http.get('/api/lesson/'+$scope.lessonId, {})
			.success(function(data, status, headers, config){
			var json = angular.fromJson(data);
			console.log('data:'+JSON.stringify(json));
			if (status == 200){				
				var lesson = json;
				$scope.title = lesson.title;
				$scope.shareData.lessonTitle = lesson.title;
				$scope.content = lesson.content;
				$scope.practiceContent = lesson.practice_content;				
				$scope.data.htmlModel = lesson.practice_content;
			}
		})
		.error(function(data, status, headers, config){			
			$mdDialog.show(
		      $mdDialog.alert()
		        .title('Loading lesson failed!!!')
		        .content('Something happen make your incompletely action. Please try again later.')
		        .ariaLabel('Loading failed')
		        .ok('Got it!')		        
	    );
		});
	}, 500);


	$scope.selectContent = function () {
		$scope.sectionSelected = 'content';
	};
	$scope.selectCode = function () {			
		$scope.sectionSelected = 'code';
	};
	$scope.navBack = function(){
		console.log("."+$scope.id);
		$location.path('lesson/'+$scope.id);
	};
	$scope.editNote = function(ev){
		$mdDialog.show({
			controller: 'DetailNoteCtrl',
			templateUrl: 'note_view/detail_note_view.html',
			target: ev
		})
		.then(function(result){			
		})
	};
	$scope.tabNext = function () {
		$scope.data.selectedTabIndex = Math.min($scope.data.selectedTabIndex + 1, $scope.tabs.length-1) ;
	};
	$scope.tabPrevious = function () {
		$scope.data.selectedTabIndex = Math.max($scope.data.selectedTabIndex - 1, 0);
	};
	$scope.aceLoaded = function(){
		// do something
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
}]);