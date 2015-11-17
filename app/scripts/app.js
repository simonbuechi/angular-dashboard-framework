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

angular.module('fireboard', ['adf', 
                            'firebase', 
                            'adf.structures.base', 
                            'adf.widget.news', 
                            'adf.widget.markdown', 
                            'adf.widget.iframe', 
                            'adf.widget.chart',
                            'adf.widget.data', 
                            'adf.widget.login', 
                            'adf.widget.version',
                            'ngRoute'])
  .run(['loginService', '$rootScope', '$location', 'FIREBASEURL', function(loginService, $rootScope, $location, FIREBASEURL) {
    $rootScope.auth = loginService.init('/start');
  //  $rootScope.uid = $rootScope.auth.uid;
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
      if (error === "AUTH_REQUIRED") {
        $location.path("/start");
      }    
    }); 
  }])
  .config(function(dashboardProvider, $routeProvider){
    dashboardProvider.widgetsPath('widgets/');
  })
  .config(function($routeProvider){

    $routeProvider
      .when('/start', {
        controller: 'dashboardCtrl',
        controllerAs: 'dashboard',
        templateUrl: 'partials/public.html',
        resolve: {
          data: function($route, storeService){
            return storeService.getByPath("/public/start");
          }
        }
      })
      .when('/:id', {
        controller: 'dashboardCtrl',
        controllerAs: 'dashboard',
        templateUrl: 'partials/public.html',
        resolve: {
          data: function($route, storeService){
            return storeService.get($route.current.params.id);
          }
        }
      })
      .when('/user/:id', {
        controller: 'dashboardCtrl',
        controllerAs: 'dashboard',
        templateUrl: 'partials/private.html',
        resolve: {
          "currentAuth": ["Auth", function(Auth) {
            return Auth.$requireAuth();
          }],
          data: function($route, storeService){
            return storeService.get($route.current.params.id);
          }
        }
      })
      .otherwise({
        redirectTo: '/start'
      });
  })
  .controller('navigationCtrl', function($scope, $q, $location, storeService,  $rootScope, loginService, demoService){
    var nav = this;
    nav.navCollapsed = true;
        $rootScope.$broadcast('navChanged');

    $rootScope.auth.$onAuth(function(authData) {
      $scope.authData = authData;
      if (authData) {
        $rootScope.uid = authData.uid;
      }
    });
    $scope.login = function(e) {
      loginService.login($scope.email, $scope.password, function() {
        $rootScope.$broadcast('navChanged');
      });
    }
    $scope.logout = function() {
       loginService.logout();
       $location.path('/start');
    };
    $scope.resetDefault = function() {
       demoService.resetDefault();
    };
    this.toggleNav = function(){
      nav.navCollapsed = ! nav.navCollapsed;
    };

    this.navClass = function(page) {
      var currentRoute = $location.path().substring(1);
      return page === currentRoute || new RegExp(page).test(currentRoute) ? 'active' : '';
    };

    this.create = function(){
      var id = new Date().getTime();
      var model =  {
        "id": id,
        "title": "New Board",
        "structure": "4-4-4",
        "rows": [{
          "columns": [{
            "styleClass": "col-sm-6 col-md-4 col-lg-4",
            "widgets": []
          },{
            "styleClass": "col-sm-6 col-md-4 col-lg-4",
            "widgets": []
          },{
            "styleClass": "col-sm-6 col-md-4 col-lg-4",
            "widgets": []
          }]
        }]
      };
      storeService.set(id, model);
      $location.path("/user/" + id);
    //  console.log("new dashboard created user: " + $rootScope.uid + " id: " + id);
    };

    $scope.$on('navChanged', function(){
      nav.items = storeService.getAll();
      console.log("nav.items");
      console.log(nav.items);
    });

//    if (typeof $rootScope.uid === "undefined" && $rootScope.auth) {
    if ($rootScope.auth.$getAuth()) {
      $rootScope.uid = $rootScope.auth.$getAuth().uid;    
    }

    nav.items = storeService.getAll();
  })
  .controller('dashboardCtrl', function($location, $rootScope, $scope, $routeParams, storeService, data){
    this.name = $routeParams.id;
    this.model = data;

    $scope.$on('adfDashboardDeleted', function(event, name) {
      console.log("adfDashboardDeleted triggered");
      storeService.delete(name);
      $location.path('/start');
      $rootScope.$broadcast('navChanged');
    });

    $scope.$on('adfDashboardChanged', function(event, name, model) {
      console.log("adfDashboardChanged triggered");
      storeService.set(name, model);
      $rootScope.$broadcast('navChanged');
    });
  });