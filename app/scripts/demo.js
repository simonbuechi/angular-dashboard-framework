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

        var template = new Firebase(FIREBASEURL + "/public/boards/template");
        var obj = $firebaseObject(template);

        obj.$loaded().then(function(){
        	var ref = new Firebase(FIREBASEURL + "/users/" + $rootScope.uid  + "/boards/sample");
        	ref.set($firebaseUtils.toJSON(obj));
        });

        
        $rootScope.$broadcast('navChanged');
      }
	}
  });



