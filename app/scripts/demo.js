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

angular.module('fireboard')
  .factory('demoService', function($firebaseObject, $firebaseArray, $firebaseUtils, $rootScope, FIREBASEURL){
    return {
      resetDefault: function(){
        var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid + "/boards/");
        $firebaseObject(ref).$remove(); 

        var id1 = 1;
        var id2 = 2;

        var model1 = {
     	  id: id1,
	      title: "Overview",
	      rows: [{
	        columns: [{
	          styleClass: "col-md-4",
	          widgets: [{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "# Fireboard \n A dashboard built with Angular Dashboard Framework and Firebase. It shows data from json, markdown files and iframes, but does not serve as a data storage / aggregation. Simple charts using D3 and C3."
	            }
	          },{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "## Purpose\n This is a use case for a personal dashboard. More to follow."
	            }
	          },{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "## Sources\n This Dashboard is based on [Angular Dashboard Framework](https://github.com/sdorra/angular-dashboard-framework)"
	            }
	          }]
	        }, 
	        {
	          styleClass: "col-md-4",
	          widgets: [{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "## Features\n* RSS feeds\n* Data (JSON file)\n* chart (JSON file)\n* markdown (text or md-file)\n* iframe (URL)"
	            }
	          },{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "placeholder"
	            }
	          },{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "placeholder"
	            }
	          }]
	        },
	        {
	          styleClass: "col-md-4",
	          widgets: [{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "## Technologies \n* Angular.js\n* Bootstrap\n* Showdown for Markdown\n* C3 and D3 for charts"
	            }
	          },{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "placeholder"
	            }
	          },{
	            type: "markdown",
	            title: "Widget",
	            config: {
	              content: "placeholder"
	            }
	          }]
	        }]
	      }]
	    };
	    var model2 = {
	      id: id2,
	      title: "Widget Gallery",
	      rows: [{
	        columns: [{
	          styleClass: "col-md-4",
	          widgets: [{
	            type: "markdownfile",
	            title: "Info",
	            config: { 
	              url: "data/widget-markdown-widget.md"
	            }
	          },{
	            type: "bignumber",
	            config: { 
	              url: "data/json-data-values-thresholds.json",
	              thresholds: true
	            },
	            title: "data example big"            
	          },{
	            type: "smallnumber",
	            config: { 
	              url: "data/json-data-values.json"
	            },
	            title: "data example small"            
	          }]
	        }, 
	        {
	          styleClass: "col-md-4",
	          widgets: [{
	            type: "news",
	            config: {
	              url: "http://feeds.feedburner.com/simonbuechi-imdb-ratings"
	            },
	            title: "news/rss example"
	          },{
	            type: "iframe",
	            config: { 
	              url: "http://buechi.name",
	              height: "240px",
	              width: "320px"
	            },
	            title: "iframe example"
	          },{
	            type: "markdownfile",
	            title: "Info",
	            config: {
	              url: "data/widget-markdown-chart.md"
	            }
	          }]
	        },
	        {
	          styleClass: "col-md-4",
	          widgets: [{
	            type: "chart",
	            title: "Column chart",
	            config: { 
	              url: "data/json-data-chart-category.json",
	              type: "bar",
	              height: "160",
	              showLegend: false,
	              showTooltip: true,
	              rotated: false
	            }
	          },{
	            type: "chart",
	            title: "Bar chart",
	            config: { 
	              url: "data/json-data-chart-category.json",
	              type: "bar",
	              height: "160",
	              showLegend: false,
	              showTooltip: true,
	              rotated: true
	            }
	          },{
	            type: "chart",
	            title: "Spline chart",
	            config: { 
	              url: "data/json-data-chart.json",
	              type: "spline",
	              height: "160",
	              showLegend: false,
	              showTooltip: true,
	              rotated: false
	            }
	          },{
	            type: "chart",
	            title: "Line chart",
	            config: { 
	              url: "data/json-data-chart.json",
	              type: "line",
	              height: "160",
	              showLegend: false,
	              showTooltip: true,
	              rotated: false
	            }
	          }]          
	        }]
	      }]
	    };

        var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid  + "/boards/" + id2);
        ref.set($firebaseUtils.toJSON(model2));
        var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid  + "/boards/" + id1);
        ref.set($firebaseUtils.toJSON(model1));

/*
        var id3 = 3;
        var id4 = 4;
        var model3 = {};
	    var model4 = {};
        var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid  + "/boards/" + id3);
        ref.set($firebaseUtils.toJSON(model3));        
        var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid  + "/boards/" + id4);
        ref.set($firebaseUtils.toJSON(model4));     
*/
        $rootScope.$broadcast('navChanged');
      }
	}
  });



