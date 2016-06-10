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

angular.module('adf.widget.markdown', ['adf.provider', 'btford.markdown'])
  .config(function(dashboardProvider){

    dashboardProvider
      .widget('markdown', angular.extend({
        title: 'Markdown',
        description: 'Display content in markdown notation',
        controller: 'markdownCtrl',
        templateUrl: '{widgetsPath}/markdown/src/view.html',
        edit: {
          templateUrl: '{widgetsPath}/markdown/src/edit.html',
          reload: false
        }
        }))
      .widget('markdownfile', angular.extend({
        title: 'Markdown File',
        description: 'Display content in markdown notation from file',
        controller: 'markdownfileCtrl',
        templateUrl: '{widgetsPath}/markdown/src/view-file.html',
        edit: {
          templateUrl: '{widgetsPath}/markdown/src/edit-file.html'
        }
        }));
  })
  .controller('markdownCtrl', function($scope, config){
    if (!config.content){
      config.content = '';
    }
    $scope.config = config;
  })
  .controller('markdownfileCtrl', function($scope, config){
    if (!config.url){
      config.url = '';
    } 
    $scope.config = config;
  });

/* 
https://github.com/btford/angular-markdown-directive
*/
angular.module('btford.markdown', ['ngSanitize']).
  provider('markdownConverter', function () {
    var opts = {};
    return {
      config: function (newOpts) {
        opts = newOpts;
      },
      $get: function () {
        return new showdown.Converter(opts);
      }
    };
  }).
  directive('btfMarkdown', ['$sanitize', 'markdownConverter', function ($sanitize, markdownConverter) {
    return {
      restrict: 'AE',
      link: function (scope, element, attrs) {
        if (attrs.btfMarkdown) {
          scope.$watch(attrs.btfMarkdown, function (newVal) {
            var html = newVal ? $sanitize(markdownConverter.makeHtml(newVal)) : '';
            element.html(html);
          });
        } else {
          var html = $sanitize(markdownConverter.makeHtml(element.text()));
          element.html(html);
        }
      }
    };
  }]);