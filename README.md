Fireboard
===================
A dashboard built with [Angular Dashboard Framework](https://github.com/sdorra/angular-dashboard-framework) and [Firebase](https://www.firebase.com). It shows data from json, markdown files and iframes, but does not serve as a data storage / aggregation. Simple charts using [D3](http://d3js.org) and [C3](http://c3js.org).

Demo
----
A live demo can be viewed [here](http://simonbuechi.github.io/angular-firebase-dashboard/). 

Setup
======

Install
-------

Install bower and grunt:

```bash
npm install -g bower
npm install -g gulp
```

Clone the repository:

```bash
git clone https://github.com/simonbuechi/angular-firebase-dashboard
cd angular-firebase-dashboard
```

Install npm and bower dependencies:

```bash
npm install
bower install
```


Firebase setup
---------------
1. Create account on http://www.firebase.com
2. Create new app
3. Replace firebase URL in scripts/app.js
```  
.value('firebaseUrl', 'https://YOUR_APP.firebaseio.com')
.value('firebaseDashboardsUrl', 'https://YOUR_APP.firebaseio.com/dashboards/')
```
4. Set security rules in your Firebase app:
```
{
  "rules": {
    "users": {
      "$user_id": {
        ".write": "$user_id === auth.uid",
        ".read": "$user_id === auth.uid"
      }
    },
    "public": {
    	".read": true,
      ".write": "auth != null"
    }
  }
}
```

Run
----
You can start the sample dashboard, by using the serve gulp task:

```bash
gulp serve
```

Now you open the sample in your browser at http://localhost:9001/sample

Or you can create a release build of angular-dashboard-framework and the samples:

```bash
gulp all
```
The sample and the final build of angular-dashboard-framework are now in the dist directory.


Implementation
============

- Angular Dashboard Framework
- Bootstrap
- Angular Bootstrap
- D3 visualization library
- C3 D3-based reusable chart library
- ...
- Color palette: http://www.google.com/design/spec/style/color.html#color-color-palette


Currently implemented data sources
-----------------------
- RSS feed
- JSON
- .md file
- directly entered (markdown) text
- URL, shown as iframe

Widgets
--------
- markdown (text or file)
- iframe (url)
- news (rss)
- data/numbers (json)
- chart (json)


ToDo / Issues
======

- Clean implementation of widgets as submodules
- Make chart and edit widget editable via UI 
- More efficient data queries to/from Firebase
- Submodules (widgets) are not loaded properly, sometimes. As a workaround, use git command (e.g. git submodule add https://github.com/simonbuechi/adf-widget-markdown app/widgets/markdown)
