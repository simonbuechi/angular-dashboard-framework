'use strict';

angular.module('adf.widget.data', ['adf.provider'])
  .config(function(dashboardProvider){

    dashboardProvider
      .widget('bignumber', {
        title: 'Big Number',
        description: 'Display json data in big size',
        controller: 'bignumberCtrl',
        templateUrl: '{widgetsPath}/data/view-big.html',
        resolve: {
          feed: function(jsonNumberService, config){
            if (config.url){
              return jsonNumberService.get(config.url, config.thresholds);
            }
          }
        }
      })
      .widget('smallnumber', {
        title: 'Small Number',
        description: 'Display json data in small size',
        controller: 'smallnumberCtrl',
        templateUrl: '{widgetsPath}/data/view-small.html',
        resolve: {
          feed: function(jsonNumberService, config){
            if (config.url){
              return jsonNumberService.get(config.url, '');
            }
          }
        }
      })
      .widget('drupalbignumber', {
        title: 'Big Number with Drupal JSON Feed',
        description: 'Display data from Drupal',
        controller: 'smallnumberCtrl',
        templateUrl: '{widgetsPath}/data/view-small.html',
        resolve: {
          feed: function(jsonDrupalService, config){
            if (config.url){
              return jsonDrupalService.get(config.url, '');
            }
          }
        }
      })
      .widget('todoist', {
        title: 'Todoist data',
        description: 'Display data from Todoist',
        controller: 'todoistCtrl',
        templateUrl: '{widgetsPath}/data/view-todoist.html',
        resolve: {
          feed: function(todoistService, config){
            if (config.token){
              return todoistService.get(config.token);
            }
          }
        }
      });
  })
  .controller('bignumberCtrl', function($scope, feed){
    $scope.feed = feed;

    $scope.highlightClass = function(entry) {
      if (entry.value > entry.threshigh && entry.threshigh) {
        return 'greenflag';
      } else if (entry.value < entry.threslow && entry.threslow) {
        return 'redflag'
      } 
      else {
        return '';
      }
    };
  })
  .controller('smallnumberCtrl', function($scope, feed){
    $scope.feed = feed;
  })
  .controller('todoistCtrl', function($scope, feed){
    $scope.feed = feed;
  });

