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
  .constant('FIREBASEURL', 'https://brilliant-fire-8576.firebaseio.com/')
  .factory("Auth", ["$firebaseAuth", "FIREBASEURL", function($firebaseAuth, FIREBASEURL) {
      var ref = new Firebase(FIREBASEURL);
      return $firebaseAuth(ref);
    }
  ])
  .factory('loginService', ['$rootScope', '$firebaseAuth', '$timeout', 'firebaseRef', 'FIREBASEURL',
    function($rootScope, $firebaseAuth, $timeout, firebaseRef, FIREBASEURL) {
       var auth = null;
       return {
          init: function() {
             return auth = $firebaseAuth(firebaseRef());
          },
          login: function(email, pass, callback) {
             assertAuth();
             auth.$authWithPassword({
                email: email,
                password: pass,
                rememberMe: true
             }).then(function(user) {
                   if( callback ) {
                      $timeout(function() {
                         callback(null, user);
                      });
                   }
                }, callback);
          },
          logout: function() {
            assertAuth();
            auth.$unauth();
          },
          getAuth: function() {
            auth.$getAuth();
          },
          changePassword: function(opts) {
            console.log("changepassword");
          },
          createAccount: function(email, pass, callback) {
            console.log("createAccount");
          },
          createProfile: function(id, email, callback) {
            console.log("createProfile");
          }
       };
       function assertAuth() {
          if( auth === null ) { throw new Error('Must call loginService.init() before using its methods'); }
       }
    }])  
  .factory('storeService', function($firebaseObject, $firebaseArray, $firebaseUtils, $rootScope, FIREBASEURL){

    return {
      getAll: function(){
        if ($rootScope.uid) {
          var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid + "/boards/");
          return $firebaseArray(ref);
        }
      },
      get: function(id){
        if ($rootScope.uid) {
          var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid + "/boards/" + id);
          return $firebaseObject(ref).$loaded();
        }
      },
      set: function(id, data){
        data.id = id;
        var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid  + "/boards/" + id);
        ref.set($firebaseUtils.toJSON(data));
      },
      delete: function(id){
        var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid + "/boards/" + id);
        $firebaseObject(ref).$remove();  
      }
    };
  })
  .factory('firebaseRef', ['Firebase', 'FIREBASEURL', function(Firebase, FIREBASEURL) {
    return function(path) {
      return new Firebase(pathRef([FIREBASEURL].concat(Array.prototype.slice.call(arguments))));
    }
  }]);

function pathRef(args) {
   for(var i=0; i < args.length; i++) {
      if( typeof(args[i]) === 'object' ) {
         args[i] = pathRef(args[i]);
      }
   }
   return args.join('/');
};