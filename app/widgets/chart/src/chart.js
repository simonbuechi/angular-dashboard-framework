'use strict';

angular.module('adf.widget.chart', ['adf.provider', 'angular-c3'])
  .config(function(dashboardProvider){

    dashboardProvider
      .widget('chart', {
        title: 'Chart C3',
        description: 'Displays chart from JSON',
        templateUrl: '{widgetsPath}/chart/src/view.html',
        controller: 'chartCtrl',
        edit: {
          templateUrl: '{widgetsPath}/chart/src/edit.html'
        },
        resolve: {
          feed: function(jsonChartService, config){
            if (config.url){
              return jsonChartService.get(config.url);
            }
          }
        }       
      })
/*      
      .widget('chartcustom', {
        title: 'Chart custom',
        description: 'Displays custom chart from JSON',
        templateUrl: '{widgetsPath}/chart/src/view-custom.html',
        controller: 'chartCustomCtrl',
        edit: {
          templateUrl: '{widgetsPath}/chart/src/edit-custom.html'
        },
        resolve: {
          feed: function(jsonChartService, config){
            if (config.url){
              return jsonChartService.get(config.url);
            }
          }
        }       
      })
*/
      .widget('drupalchart', {
        title: 'Chart Drupal',
        description: 'Displays chart from JSON',
        templateUrl: '{widgetsPath}/chart/src/view.html',
        controller: 'chartCtrl',
        edit: {
          templateUrl: '{widgetsPath}/chart/src/edit.html'
        },
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

      var trendColor = '#90A4AE';
      var trendDiff = feed[Math.floor(feed.length/2)].trend - feed[Math.floor(feed.length/2)-1].trend;
      if(trendDiff > config.trendtolerance || !config.trendtolerance) {
      	if((trendDiff > 0 && !config.trendinverse) || (trendDiff < 0 && config.trendinverse)) {
			trendColor = '#8BC34A';
      	} else {
      		trendColor = '#F44336';
      	}
      }

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
                value: ['trend','value']
              },
              colors: {
            	trend: trendColor,
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
            padding: {top: 8},
          };
        break;
      }

      if (config.timeseries) {
        $scope.config.axis.x.type = 'timeseries';
        $scope.config.axis.x.tick.format = d3.time.format("%d %b %y");
        $scope.config.axis.x.tick.count = 6;
      }

      $scope.config.size = {height: config.height ? config.height : "240"};
      $scope.config.legend = {show: config.showLegend ? config.showLegend : false};
      $scope.config.tooltip = {show: config.showTooltip ? config.showTooltip : false};
    }
  })
  .controller('chartCustomCtrl', function($scope, feed, config){

    // idea: enable pure d3 code to be entered and to be rendered
    if (feed){ 
    	$scope.config.code = config.code;
    }

  });
