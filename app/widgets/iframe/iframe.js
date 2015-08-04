'use strict';

angular.module('adf.widget.iframe', ['adf.provider'])
  .config(function(dashboardProvider){
    dashboardProvider
      .widget('iframe', {
        title: 'iframe',
        description: 'Embed an external page into the dashboard',
        templateUrl: '{widgetsPath}/iframe/view.html',
        edit: {templateUrl: '{widgetsPath}/iframe/edit.html'},
        controller: 'iframeController',
        controllerAs: 'iframe'
      });
  })
  .controller('iframeController', function($sce, config){
    if (config.url){
      this.url = $sce.trustAsResourceUrl(config.url);
    }
  });
