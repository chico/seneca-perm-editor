;(function(window, angular) {
  "use strict";

  function noop(){for(var i=0;i<arguments.length;i++)if('function'==typeof(arguments[i]))arguments[i]()}

  var prefix = seneca.config['perm-editor'].prefix

  var options = {

  }

  var senecaPermEditorModule = angular.module('senecaPermEditorModule',[])

  senecaPermEditorModule.controller("senecaPermEditorCtrl", ["$scope", "$rootScope", function($scope, $rootScope) {
    $scope.show_main = true
  }]);

}(window, angular));

