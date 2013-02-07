# router.js

A simple client-side request router to be used in conjunction
with [History.js](https://github.com/balupton/History.js/) and
[jQuery](http://jquery.com/) to create single-page web
applications.

A request router simply matches routes (aka URLs) with JavaScript
functions. router.js can intercept link clicks for client-side
handling, while dynamically updating the `window.location` via
History.js.

It will also trigger the appropriate function based on the initial
`window.location` value on page load, so your client-side logic
can respond to inbound links to specific routes, making it easy
to create single-page web applications that correctly handle
bookmarks and other direct links.

## Usage

```html
<script src="deps/jquery-1.9.1.min.js"></script>
<script src="deps/jquery.history.min.js"></script>
<script src="lib/router.js"></script>
<script>
(function ($) {
	// a couple sample handlers
	function handler_one () {
		console.log ('handler_one() called!');
	}

	function handler_two (name) {
		console.log ('handler_two() called!');
		console.log (name);
	}

	// initialize the router and define your routes
	router.init ({
		'/one': handler_one,
		'/hello/:name': handler_two
	});

	// to manually trigger a route change
	router.go ('/one');
	router.go ('/hello/world');
})(jQuery);
</script>
```

Also see the included [demo.html](https://github.com/jbroadway/router.js/blob/master/demo.html)
for a complete example.
