'use strict';

angular.module('adf.widget.login', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('login', {
        title: 'Login',
        description: 'Login form',
        templateUrl: '{widgetsPath}/login/src/view.html'    
      });
  })
 // .controller('loginCtrl', function($scope, feed, config){
//  });
