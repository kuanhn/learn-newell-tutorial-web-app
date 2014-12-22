'use strict'

var app = angular.module('myApp.view.lesson', ['ngRoute']);

app.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/lesson/:id', {
    templateUrl: 'lesson_view/lesson_view.html',
    controller: 'LessonCtrl'
  });
}]);

app.controller('LessonCtrl', ['$scope', '$routeParams', '$location', '$http', '$timeout', 'shareData', function($scope, $routeParams, $location, $http, $timeout, shareData){
		$scope.data = shareData;
		$scope.id = $routeParams.id;
		$scope.data.categoryId = $scope.id;
		$scope.selected = "";

		$scope.lessons = [];		
		$timeout(function(){ /* delay before transaction end */
			$http.get('/api/lessons/'+$scope.id, {})
				.success(function(data, status, headers, config){
				var json = angular.fromJson(data);
				console.log('data:'+json);
				if (status == 200){
					for (var i = 0; i < json.length; i++){
						var lesson = json[i];
						$scope.lessons.push({id: lesson.lesson_id, name: lesson.title, state: 'passed'});
					}
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
		}, 700);

		$scope.selectLesson = function(lesson){
			$scope.data.lessonDetail = true;
			$scope.selected = lesson.id;			
			$location.path('lesson/'+$scope.id+"/"+lesson.id);
		};
		$scope.navBack = function(){
			$scope.data.detailView = false;
			$location.path('main');
		}

}]);