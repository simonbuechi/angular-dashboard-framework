/*
 * The MIT License
 *
 * Copyright (c) 2015, Sebastian Sdorra
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

angular.module('adf.widget.calendar', ['adf.provider', 'angular-d3'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('calendar', {
        title: 'Calendar',
        description: 'Shows calendar in different versions',
        templateUrl: '{widgetsPath}/calendar/src/view.html',
        controller: 'calendarCtrl',
        resolve: {
          feed: function(tabletopService, config){
            if (config.url){
              return tabletopService.get(config.url);
            }
          }
        },
        edit: {
          templateUrl: '{widgetsPath}/calendar/src/edit.html'
        }
      });
  })
  .controller('calendarCtrl', function($scope, feed, config){
    $scope.feed = feed[0]; 
});


/*
 * angular D3 charts
 */

angular.module('angular-d3', [])
  .directive('d3Calendar1080m', function () { 
    return {
      restrict: 'E', 
      scope: {
          data: '=',
      },
      link: function (scope, elem, attrs) {
          // The d3.js code for generation of bar graph. further reading should be done from http://d3js.org/
        var margin = {top: 20, right: 10, bottom: 10, left: 10},
            width = 1100 - margin.left - margin.right,
            height = 620 - margin.top - margin.bottom;
        var size = 15;
        var TRANSITION_TIME = 750;
        var parseDate = d3.time.format("%y-%b").parse;
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
            return d.date + ", " + d.year + " Jahre alt" +
              (d.comment ? "<br>Kommentar: " + d.comment : "") +
              (d.project ? "<br>Project: " + d.project : "") +
              (d.learn ? "<br>Learning: " + d.learn : "") ;
          });
        var colorscale = d3.scale.ordinal()
            .domain([1,2,3,4,5,6,7,8,9])
            .range(["#d73027","#f46d43","#fdae61","#fee08b","#ffffbf","#d9ef8b","#a6d96a","#66bd63","#1a9850"]);
        var svg = d3.select("d3-calendar1080m").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
        svg.call(tip);

      //  console.log(scope.data);

        var data = d3.nest()
            .key(function(d) {return d.year;})
            .sortKeys(d3.ascending)
            .entries(scope.data);

            //    console.log(data);

        var row = svg.selectAll(".year").data(data).enter()
                      .append("g");
        row.attr("class", "year")
                      .attr("transform",  function(d, i) { return "translate(" + (d.key % 15 ) * size*4.5 + "," + Math.floor(d.key/15) *size*6.5 + ")";});
        row.append("text")
                      .attr("x", 0)
                      .attr("y", -10)
                      .attr("dy", ".35em")
                      .text(function(d) { return d.key; }); 
        var cell = row.selectAll(".item").data(function(d) {return d.values}).enter()
                       .append("circle")
                       .attr("cx", function(d) { return ((d.month-1) % 3) * size * 1.3 + size/2; })
                       .attr("cy", function(d) { return Math.floor((d.month-1)/3)* size * 1.3 + size/2; })
                       .attr("r", size/2)
                       .attr("class", function(d) { 
                          return "item col" + d.rating 
                          + (d.comment ? " marked" : ""); });
        row.selectAll(".item")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide);    
              
        }
     };
   })
  .directive('d3Calendar365d', function () { 
    return {
      restrict: 'E', 
      scope: {
          data: '=',
      },
      link: function (scope, elem, attrs) {
        Date.prototype.getISODay = function(){ return (this.getDay() + 6) % 7; }
        var width = 1100,
              height = 160,
              cellSize = 20; // cell size
        var percent = d3.format(".1%"),
            format = d3.time.format("%d.%m.%Y");
        var today = format(new Date());
        var tip = d3.tip().attr('class', 'd3-tip').offset([-10, 0]).html(function(d) {
            return d3.select(this).attr("info");
         // return d[0].date + "<br>" + d.rating + "<br>";
        });

        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        var days = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'So'];
        /* 
        var color = d3.scale.quantize()
            .domain([1, 9])
            .range(d3.range(11).map(function(d) { return "col" + d; }));
        var opacity = d3.scale.quantize()
            .domain([-.05, .05])
            .range(d3.range(0,1,0.1));
        */
        var svg = d3.select("d3-calendar365d").selectAll("svg")
            .data([new Date().getFullYear()])
          .enter().append("svg")
            .attr("width", width)
            .attr("height", height)
          .append("g")
          //  .attr("transform", "translate(" + ((width - cellSize * 53) / 2) + "," + (height - cellSize * 7 - 1) + ")");
          .attr("transform", "translate(" + 2*cellSize + "," + cellSize + ")");
        svg.call(tip);
        var rect = svg.selectAll(".item")
            .data(function(d) { return d3.time.days(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
          .enter().append("rect")
            .attr("class", "item")
            .attr("width", cellSize-6)
            .attr("height", cellSize-6)
            .attr("rx",cellSize/2)
            .attr("ry",cellSize/2)
            .attr("x", function(d) { return d3.time.mondayOfYear(d) * cellSize + 3; })
            .attr("y", function(d) { return d.getISODay() * cellSize + 3; })
            .datum(format);
      //  rect.append("title")
      //      .text(function(d) { return d; });
        svg.selectAll(".month")
            .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
          .enter().append("path")
            .attr("class", "month")
            .attr("d", monthPath); 

        svg.append("g")
          .attr("transform", "translate(20," + -0.4 * cellSize + ")")
          .selectAll('.textm')
          .data(months)
          .enter()
          .append('text')
          .attr('class', 'textm')
          .text(function (d, i) { return months[i]; })
          .attr('x', function (d, i) { return i * cellSize * 4.4;})
          .attr('y', 0);  
 
        svg.append("g")
          .attr("transform", "translate(" + -1.2 * cellSize + "," + 0.75 * cellSize + ")")
          .selectAll('.textd')
          .data(days)
          .enter()
          .append('text')
          .style('text-anchor', 'left')
          .attr('class', 'textd')
          .text(function (d, i) { return days[i]; })
          .attr('x', 0)
          .attr('y', function (d, i) { return i * cellSize;});  


        var data = d3.nest()
            .key(function(d) { return d.date; })
            .map(scope.data);

        
     /*   rect.filter(function(d) { return d in data; })
            .attr("class", function(d) { return "day " + color(data[d][0].quality); })
            .attr("opacity", function(d) { return opacity(data[d][0].performance); })
          .select("title")
            .text(function(d) { return d + ": " + percent(data[d][0].quality); }); 

        var dataFiltered = svg.selectAll(".day").data(data).enter().append("rect")
        //  .attr("class", function(d) { return "day " + color(data[d][0].rating); })
            .attr("class", "col5")
            .attr("width", cellSize)
            .attr("height", cellSize);
*/
        var dataFiltered =  rect.filter(function(d) { return d in data; })
            .attr("class", function(d) { return "item col" + data[d][0].rating + (data[d][0].comment ? " marked" : ""); })
            .attr("info", function(d) { return data[d][0].comment ? data[d][0].date + "<br>Kommentar: <br> " + data[d][0].comment : ""; } );

     //   console.log(data["02.06.2016"][0].rating);

        rect.filter(function(d) {return d==today;})
          .attr("class", "item coltoday")
          .attr("info", "This is today");

        svg.selectAll(".item")
            .on('mouseover', tip.show)
            .on('mouseout', tip.hide); 

        function monthPath(t0) {
          var t1 = new Date(t0.getFullYear(), t0.getMonth() + 1, 0),
              d0 = t0.getISODay(), w0 = d3.time.mondayOfYear(t0),
              d1 = t1.getISODay(), w1 = d3.time.mondayOfYear(t1);
          return "M" + (w0 + 1) * cellSize + "," + d0 * cellSize
              + "H" + w0 * cellSize + "V" + 7 * cellSize
              + "H" + w1 * cellSize + "V" + (d1 + 1) * cellSize
              + "H" + (w1 + 1) * cellSize + "V" + 0
              + "H" + (w0 + 1) * cellSize + "Z";
        }
      }
    };
});

