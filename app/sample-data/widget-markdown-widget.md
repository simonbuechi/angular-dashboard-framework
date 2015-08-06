# Widgets

## Configuration

```javascript
widgets: [{
	type: "news",
	title: "news/rss example",
	config: {
		url: "http://feeds.feedburner.com/simonbuechi-imdb-ratings"
	}
},
{...}
]

```
    
## Types

* news (RSS feed)
* data (JSON file)
* chart (JSON file)
* markdown (text or md-file)
* iframe (URL)