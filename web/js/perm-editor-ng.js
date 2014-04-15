;(function(window, angular) {
  "use strict";

  var prefix = seneca.config['perm-editor'].prefix;

  var options = {
  };

  var senecaPermEditorModule = angular.module('senecaPermEditorModule',[]);

  senecaPermEditorModule.directive('senecaPermEditor', function() {
    var def = {
      restrict:'A',
      scope:{
      },
      link: function( scope, elem, attrs ){

      },
      templateUrl: prefix+"/_perm_editor_template.html"
    }
    return def;
  });

  senecaPermEditorModule.controller("senecaPermEditorCtrl", ["$scope", "$rootScope", "$http", function($scope, $rootScope, $http) {

    $scope.msg = '';

    $http({method: 'GET', url: prefix + '/rest/sys_user?admin=1', cache: false}).success(function(data, status) {
      $scope.users = data.list;
      $scope.roles = [];
      for(var i = 0; i < $scope.users.length; i++) {
        $scope.roles[$scope.users[i].email] = ($scope.users[i].perm) ? $scope.users[i].perm.roles.join(',') : '';
      }
      $scope.show_main = true;
    });

    $scope.save = function() {
      for(var i = 0; i < $scope.users.length; i++) {

        var roles = $scope.roles[$scope.users[i].email].split(',');
        for(var j = 0; j < roles.length; j++) {
          roles[j] = roles[j].trim();
        }

        $scope.users[i].perm = {roles: roles};

        var idpart = '/' + $scope.users[i].id;
        $http({method: 'POST', url: prefix + '/rest/sys_user' +  idpart, data:$scope.users[i], cache: false}).success(function(data, status) {
          if (status != 200) {
            $scope.msg = "Save failed";
          }
        });

      }
    }

  }]);

}(window, angular));

