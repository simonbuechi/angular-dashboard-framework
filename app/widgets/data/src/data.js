'use strict';

angular.module('adf.widget.data', ['adf.provider'])
  .config(function(dashboardProvider){

    dashboardProvider
      .widget('bignumber', {
        title: 'Data Big',
        description: 'Display json data in big size',
        controller: 'bignumberCtrl',
        templateUrl: '{widgetsPath}/data/src/view-big.html',
        edit: {
          templateUrl: '{widgetsPath}/data/src/edit.html'
        },
        resolve: {
          feed: function(jsonNumberService, config){
            if (config.url){
              return jsonNumberService.get(config.url, config.thresholds);
            }
          }
        }
      })
      .widget('smallnumber', {
        title: 'Data Small',
        description: 'Display json data in small size',
        controller: 'smallnumberCtrl',
        templateUrl: '{widgetsPath}/data/src/view-small.html',
        edit: {
          templateUrl: '{widgetsPath}/data/src/edit.html'
        },
        resolve: {
          feed: function(jsonNumberService, config){
            if (config.url){
              return jsonNumberService.get(config.url, '');
            }
          }
        }
      })
      .widget('drupalbignumber', {
        title: 'Data Big Drupal',
        description: 'Display data from Drupal',
        controller: 'smallnumberCtrl',
        templateUrl: '{widgetsPath}/data/src/view-small.html',
        edit: {
          templateUrl: '{widgetsPath}/data/src/edit.html'
        },
        resolve: {
          feed: function(jsonDrupalService, config){
            if (config.url){
              return jsonDrupalService.get(config.url, '');
            }
          }
        }
      })
      .widget('todoist', {
        title: 'Data Todoist',
        description: 'Display data from Todoist',
        controller: 'todoistCtrl',
        templateUrl: '{widgetsPath}/data/src/view-todoist.html',
        edit: {
          templateUrl: '{widgetsPath}/data/src/edit-todoist.html'
        },
        resolve: {
          feed: function(todoistService, config){
            if (config.token){
              return todoistService.get(config.token);
            }
          }
        }
      });
  })
  .controller('bignumberCtrl', function($scope, feed, config){
    $scope.feed = feed;

    $scope.highlightClass = function(entry) {

      if (entry.threshigh) {
        if((entry.value > entry.threshigh && !config.inverse) || (entry.value < entry.threslow && config.inverse)) {
          return 'greenflag';
        } else if ((entry.value < entry.threslow && !config.inverse) || (entry.value > entry.threshigh && config.inverse)) {
          return 'redflag'
        } else {
          return '';
        }
      }

    };
  })
  .controller('smallnumberCtrl', function($scope, feed){
    $scope.feed = feed;
  })
  .controller('todoistCtrl', function($scope, feed){
    $scope.feed = feed;
  });

