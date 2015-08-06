'use strict';

angular.module('adf.widget.chart', ['adf.provider', 'angular-c3'])
  .config(function(dashboardProvider){

    dashboardProvider
      .widget('chart', {
        title: 'D3/C3 chart',
        description: 'Displays chart from JSON',
        templateUrl: '{widgetsPath}/chart/src/view.html',
        controller: 'chartCtrl',
        resolve: {
          feed: function(jsonChartService, config){
            if (config.url){
              return jsonChartService.get(config.url);
            }
          }
        }       
      })
      .widget('drupalchart', {
        title: 'D3/C3 chart from Drupal',
        description: 'Displays chart from JSON',
        templateUrl: '{widgetsPath}/chart/src/view.html',
        controller: 'chartCtrl',
        resolve: {
          feed: function(jsonDrupalService, config){
            if (config.url){
              return jsonDrupalService.get(config.url);
            }
          }
        }       
      });
  })
  .controller('chartCtrl', function($scope, feed, config){

    if (feed){   

      switch(config.type) {  
        case "bar":
          $scope.config = {
            data: {
              json: feed,
              type: config.type,
              keys: {
                x : 'name',
                value: ['value']
              }
            },
            axis: {
              x: {
                type: 'category',
                tick: {
                  outer: false
                }
              },
              y: {
                tick: {
                  outer: false
                }
              },
              rotated: config.rotated
            },
            color: {pattern: ['#90A4AE', '#ECEFF1', '#263238']}
          };
        break;

        default: // line and spline chart
          $scope.config = {
            data: {
              json: feed,
              type: config.type,
              keys: {
                x: 'name',
                value: ['value']
              }
            },
            axis: {
              y: {
                tick: {
                  count: 5,
                  format: d3.format(".3n"),
                  outer: false
                }
              },
              x: {

                tick: {
                  outer: false
                }
              }
            },
            color: {pattern: ['#ECEFF1', '#90A4AE', '#263238']},
            padding: {top: 8}

          };
        break;
      }

      if (config.timeseries) {
        $scope.config.axis.x.type = 'timeseries';
        $scope.config.axis.x.tick.format = d3.time.format("%d. %b");
      }

      $scope.config.size = {height: config.height ? config.height : "240"};
      $scope.config.legend = {show: config.showLegend ? config.showLegend : false};
      $scope.config.tooltip = {show: config.showTooltip ? config.showTooltip : true};
    }
  });
