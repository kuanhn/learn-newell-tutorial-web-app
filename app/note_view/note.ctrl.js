'use strict'

var app = angular.module('myApp.view.note', ['ngRoute']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/note', {
        templateUrl: 'note_view/note_view.html',
        controller: 'NoteCtrl'
    });
}]);

app.controller('NoteCtrl', ['$scope', '$http', '$timeout', '$location', '$mdDialog', 'shareData', function($scope, $http, $timeout, $location, $mdDialog, shareData) {
    $scope.data = shareData;
    $scope.notes = [];    
    $timeout(function() {
        $http.get('/api/notes/' + $scope.data.email, {})
            .success(function(data, status, headers, config) {
                var json = angular.fromJson(data);
                console.log('data:' + JSON.stringify(json));
                if (status == 200) {
                    for (var i = 0; i < json.length; i++) {
                        var note = json[i];
                        $scope.notes.push({
                            name: note.lesson.title,
                            id: note.lesson_id,
                            language: note.lesson.language
                        });
                    }
                }
            })
            .error(function(data, status, headers, config) {
                $mdDialog.show(
                    $mdDialog.alert()
                    .title('Loading lesson failed!!!')
                    .content('Something happen make your incompletely action. Please try again later.')
                    .ariaLabel('Loading failed')
                    .ok('Got it!')
                );
            });
    }, 700);

    $scope.navBack = function() {
        $location.path('main');
    }
    $scope.selectNote = function(note) {
        $scope.data.lessonId = note.id;
        $mdDialog.show({
                controller: 'DetailNoteCtrl',
                templateUrl: 'note_view/detail_note_view.html'
            })
            .then(function(result) {})
    }
}]);

app.controller('DetailNoteCtrl', ['$scope', '$http', '$timeout', '$location', '$mdDialog', '$mdToast', 'shareData', function($scope, $http, $timeout, $location, $mdDialog, $mdToast, shareData) {
    $scope.shareData = shareData;
    $scope.command = 'create';
    $scope.noteContent = "";
    $scope.oldContent = "";    

    $http.get('/api/note/' + $scope.shareData.lessonId + '/' + $scope.shareData.email, {})
        .success(function(data, status, headers, config) {
            var json = angular.fromJson(data);
            console.log('data:' + JSON.stringify(json));
            if (status == 200) {
                var note = json;
                $scope.command = 'update';
                $scope.title = note.lesson.title;
                $scope.language = note.lesson.language;
                $scope.noteContent = note.content;
                $scope.oldContent = note.content;
            }
        })
        .error(function(data, status, headers, config) {
            var json = angular.fromJson(data);
            if (json.message) {

            } else {
                $mdDialog.show(
                    $mdDialog.alert()
                    .title('Loading note failed!!!')
                    .content('Something happen make your incompletely action. Please try again later.')
                    .ariaLabel('Loading failed')
                    .ok('Got it!'));
            }
        });

    $scope.cancelChange = function() {
        $mdDialog.cancel();
    };
    $scope.updateNote = function() {
        // update note
        // result = 'update';
        var onSuccess = function(data, status, headers, config) {
            var json = angular.fromJson(data);
            console.log('data:' + JSON.stringify(json));
            if (status == 200) {
								if (!$scope.title) $scope.title = $scope.shareData.lessonTitle;
                if ($scope.command === 'update') {
                    $mdToast.show($mdToast.simple().content('Your note for lesson "' + $scope.title + '" updated successfully'));
                } else if ($scope.command === 'create') {
                    $mdToast.show($mdToast.simple().content('Your note for lesson "' + $scope.title + '" created successfully'));
                }
            }
            $mdDialog.hide();
        };
        var onError = function(data, status, headers, config) {
            var json = angular.fromJson(data);
            console.log('data:' + JSON.stringify(json));
            $mdToast.show($mdToast.simple().content('Failed to update note'));
            $mdDialog.hide();
        };
        if ($scope.command == 'create')
            $http.post('/api/note/' + $scope.shareData.lessonId, {
                email: $scope.shareData.email,
                content: $scope.noteContent
            })
            .success(onSuccess)
            .error(onError);
        else
            $http.put('/api/note/' + $scope.shareData.lessonId, {
                email: $scope.shareData.email,
                content: $scope.noteContent
            })
            .success(onSuccess)
            .error(onError);
    };
    $scope.toLesson = function() {
        $location.path('lesson/' + $scope.language + '/' + $scope.shareData.lessonId);
        $mdDialog.hide();
    }
}]);
