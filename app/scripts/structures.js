angular.module('adf.structures.base', ['adf'])
  .config(function(dashboardProvider){

    dashboardProvider
      .structure('6-6', {
        rows: [{
          columns: [{
            styleClass: 'col-sm-6 col-md-6 col-lg-6'
          }, {
            styleClass: 'col-sm-6 col-md-6 col-lg-6'
          }]
        }]
      })
      .structure('4-8', {
        rows: [{
          columns: [{
            styleClass: 'col-sm-6 col-md-4 col-lg-4',
            widgets: []
          }, {
            styleClass: 'col-sm-6 col-md-8 col-lg-8',
            widgets: []
          }]
        }]
      })
      .structure('12', {
        rows: [{
          columns: [{
            styleClass: 'col-sm-12 col-md-12 col-lg-12',
            widgets: []
          }]
        }]
      })
      .structure('4-4-4', {
        rows: [{
          columns: [{
            styleClass: 'col-sm-6 col-md-4 col-lg-4'
          }, {
            styleClass: 'col-sm-6 col-md-4 col-lg-4'
          }, {
            styleClass: 'col-sm-6 col-md-4 col-lg-4'
          }]
        }]
      });
  });