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

    $http({method: 'GET', url: prefix + '/rest/sys_user?admin=1', cache: false}).success(function(data, status) {
      $scope.users = data.list;
      $scope.show_main = true;
    });

  }]);

}(window, angular));

