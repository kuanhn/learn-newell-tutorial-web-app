'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view.login',
  'myApp.view.main',
  'myApp.view.lesson',
  'myApp.view.detailLesson',
  'myApp.view.note',
  'myApp.view.terminal',
  'alAngularHero',
  'ui.ace',
  'myApp.version'
]).
config(['$routeProvider', function($routeProvider) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]).
controller('AppCtrl', ['$scope', 'shareData', function($scope, shareData){
	app.shareData = shareData;	
}])
