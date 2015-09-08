/*
 * The MIT License
 *
 * Copyright (c) 2015, Simon Buechi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

'use strict';

/*
 * read/get data request services
 */
angular.module('adf.provider')
  .service('jsonNumberService', function($q, $http){
    return {
      get: function(url, thresholds){
        var deferred = $q.defer();
        $http.get(url)
          .success(function(data){
            if (data){
              var feed = [];
              for (var i in data.feed.entry) {
                var name = data.feed.entry[i]['gsx$name']['$t'];
                var value = data.feed.entry[i]['gsx$value']['$t'];

                if (thresholds) {
                  var threslow = data.feed.entry[i]['gsx$threslow']['$t'];
                  var threshigh = data.feed.entry[i]['gsx$threshigh']['$t'];
                  feed.push({
                    name: name,
                    value: value,
                    threslow: threslow,
                    threshigh: threshigh
                  });      
                } else {
                  feed.push({
                    name: name,
                    value: value
                  });
                }
              };
              deferred.resolve(feed);
            } else {
              deferred.reject();
            }
          })
          .error(function(){
            deferred.reject();
          });
        return deferred.promise;
      }
    };
  })
  .service('jsonChartService', function($q, $http){
    return {
      get: function(url){
        var deferred = $q.defer();
        $http.get(url)
          .success(function(data){
            if (data){
              var feed = [];
              for (var i in data.feed.entry) {
                var name = data.feed.entry[i]['gsx$name']['$t'];
                var value = data.feed.entry[i]['gsx$value']['$t'];
                if(data.feed.entry[i]['gsx$trend']) {
                  var trend = data.feed.entry[i]['gsx$trend']['$t']; 
                }
                feed.push({
                  name: name,
                  value: value,
                  trend: (trend) ? trend : "undefined"
                });
              };
              deferred.resolve(feed);
            } else {
              deferred.reject();
            }
          })
          .error(function(){
            deferred.reject();
          });
        return deferred.promise;
      }
    };
  })
  .service('jsonDrupalService', function($q, $http){
    return {
      get: function(url){
        var deferred = $q.defer();
        $http.get(url)
          .success(function(data){
            if (data){
              var feed = [];
              for (var i in data.feed) {
                var name = data.feed[i].name;
                var value = data.feed[i]['value'];
                feed.push({
                  name: name,
                  value: value,
                });
              };
              deferred.resolve(feed);
            } else {
              deferred.reject();
            }
          })
          .error(function(){
            deferred.reject();
          });
        return deferred.promise;
      }
    };
  })
  .service('todoistService', function($q, $http){
    return {
      get: function(token){
        var deferred = $q.defer();
        $http.get('https://todoist.com/API/v6/get_productivity_stats?token=' + token)
          .success(function(data){
            if (data){
              deferred.resolve(data);
            } else {
              deferred.reject();
            }
          })
          .error(function(){
            deferred.reject();
          });
        return deferred.promise;
      }
    };
  });

/*
 * angular c3 charts
 */
angular.module('angular-c3', [])
  .factory('c3Factory', ['$q', '$timeout', function($q, $timeout) {
    var defer = $q.defer();
    var chart = {};
    var allCharts = {};
    var decorateChart = function(chart) {
    };

    chart.get = function(id) {
      var chart;
      return $timeout(function() {
        //time out to wait for the chart to be compiled
      }, 100).then(function() {
        chart = allCharts[id];
        return chart;
      });
    };

    chart.getAll = function() {
      return $timeout(function() {
        return allCharts;
      }, 100);
    };

    chart.register = function(id, chart) {
      decorateChart(chart);
      allCharts[id] = chart;
    };

    return chart;
  }])
  .directive('c3Chart', ['c3Factory', '$timeout', function(c3Factory, $timeout) {

    return {
      restrict: 'EAC',
      scope: {
        config: '='
      },
      template: '<div></div>',
      replace: true,
      link: function(scope, element, attrs) {
        //available option to show gridlines for chart
        //assign a type of line if undefined
        if(!scope.config.type) scope.config.type = 'line';

        //generate c3 chart data
        var chartData = scope.config;
        chartData.bindto = '#' + attrs.id;

        //Generating the chart
        $timeout(function() {
          var chart = c3.generate(chartData);
          c3Factory.register(attrs.id, chart);
        }, 100);
      }
    };
  }]);