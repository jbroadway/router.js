# router.js

A simple client-side request router to be used in conjunction
with [History.js](https://github.com/balupton/History.js/) and
[jQuery](http://jquery.com/). Triggers the appropriate callback
function when `router.go(url)` is called.

## Usage

```html
<script src="jquery.js"></script>
<script src="history.js"></script>
<script src="router.js"></script>
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

Also see the included [demo.html](https://github.com/jbroadway/router.js/blob/master/demo.html)
for a complete example.