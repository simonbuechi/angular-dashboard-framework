# Layouts

Based on 12-column grid. 

## Configuration

```javascript
$scope.model = {
      title: "Main dashboard",
      rows: [{
        columns: [{
          styleClass: "col-md-4",
          widgets: [...]
        },{
          styleClass: "col-md-8",
          widgets: [...]
        }]
      },{
        columns: [{
          styleClass: "col-md-12",
          widgets: [...]
        }]
      }]
    };
```
    
## Style classes

`col-md-1`, `col-md-2`, ... `col-md-12`
