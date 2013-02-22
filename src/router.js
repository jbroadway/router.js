/**
 * router.js
 *
 * A simple client-side request router to be used in conjunction
 * with History.js and jQuery. Triggers the appropriate callback
 * function when router.go(url) is called.
 *
 * Homepage: https://github.com/jbroadway/router.js
 * License: MIT
 * Author: Johnny Broadway <johnny@johnnybroadway.com>
 * 
 * Usage:
 *
 *     <script src="jquery.js"></script>
 *     <script src="history.js"></script>
 *     <script src="router.js"></script>
 *     <script>
 *     (function ($) {
 *         // a couple sample handlers
 *         function handler_one () {
 *             console.log ('handler_one() called!');
 *         }
 *         
 *         function handler_two (name) {
 *             console.log ('handler_two() called!');
 *             console.log (name);
 *         }
 *         
 *         // initialize the router and define your routes
 *         router.init ({
 *             '/one': handler_one,
 *             '/hello/:name': handler_two
 *         });
 *         
 *         // to manually trigger a route change
 *         router.go ('/one');
 *         router.go ('/hello/world');
 *     })(jQuery);
 *     </script>
 */
var router = (function ($) {
	var self = {};

	/**
	 * List of available routes. See router.set_routes() for more info.
	 */
	self.routes = {};

	/**
	 * Prefix to add to titles when setting the window title in click handling.
	 */
	self.prefix = '';

	/**
	 * Create once, used by router.get_path() to get relative urls.
	 */
	self.a = document.createElement ('a');

	/**
	 * Capture click events and route them. Set automatically by
	 * router.init().
	 *
	 * Usage:
	 *
	 *     $('body').on ('click', "a[href^='/']", router.click_handler);
	 */
	self.click_handler = function (e) {
		if (! e.altKey && ! e.ctrlKey && ! e.metaKey && ! e.shiftKey) {
			e.preventDefault ();

			var url = $(this).attr ('href'),
				title = $(this).attr ('title');

			title = (typeof title == 'undefined') ? null : self.prefix + title;

			History.pushState ({}, title, url);
		}
	};
	
	/**
	 * Turn a url into a regex and parameters for route matching.
	 * Used by router.set_routes().
	 */
	self.regexify = function (url) {
		var res = {
			url: url,
			regex: null,
			params: []
		};
	
		// parse for params
		var matches = url.match (/\:([a-zA-Z0-9_]+)/g);
		if (matches !== null) {
			for (var i in matches) {
				matches[i] = matches[i].substring (1);
			}
			res.params = matches;
			url = url.replace (/\:([a-zA-Z0-9_]+)/g, '(.*?)');
		}

		res.regex = url.replace ('/', '\\/');
	
		return res;
	};
	
	/**
	 * Set a list of routes and their callbacks. May be called again
	 * to append the list of available routes. Also called automatically
	 * by router.init().
	 *
	 * Usage:
	 *
	 *     router.init ({
	 *         '/':            function () { alert ('Home!'); },
	 *         '/hello/:name': function (name) { alert (name); }
	 *     });
	 */
	self.set_routes = function (routes) {
		for (var url in routes) {
			res = self.regexify (url);
			var r = {
				url: url,
				regex: new RegExp ('^' + res.regex + '/?$', 'g'),
				params: res.params,
				callback: routes[url]
			};
			self.routes[url] = r;
		}
	};
	
	/**
	 * Get the relative path from a full url.
	 *
	 * Usage:
	 *
	 *     router.get_path ('/hello/world');
	 */
	self.get_path = function (url) {
		self.a.href = url;
		var path = self.a.pathname + self.a.search + self.a.hash;
		path = path.match ('#')
			? path.split ('#')[1]
			: path;
		return path.match (/^\//) ? path : '/' + path;
	};
	
	/**
	 * Routes a given url to a callback function.
	 *
	 * Usage:
	 *
	 *     router.route ('/hello/world');
	 */
	self.route = function (url) {
		var path = self.get_path (url);
		for (var i in self.routes) {
			var matches = self.routes[i].regex.exec (path);
			self.routes[i].regex.lastIndex = 0;
			if (matches !== null) {
				if (matches.length > 1) {
					matches.shift ();
					self.routes[i].callback.apply (null, matches);
				} else {
					self.routes[i].callback ();
				}
				break;
			}
		}
	};

	/**
	 * Callback to bind to the History.Adapter statechange event.
	 * Used by router.init().
	 */
	self.on_statechange = function () {
		var State = History.getState ();
		self.route (State.url);
	};

	/**
	 * Wraps History.go() or History.pushState() with a consolidated syntax.
	 * Use this to trigger state changes dynamically.
	 *
	 * Usage:
	 *
	 *     router.go ('/hello/world');
	 */
	self.go = function (url) {
		if (url === parseInt (url)) {
			History.go (url);
		} else {
			History.pushState (null, null, url);
		}
	};

	/**
	 * Performs all the boring setup.
	 *
	 * Usage:
	 *
	 *     router.init ({
	 *         '/':            function () { alert ('Home!'); },
	 *         '/hello/:name': function (name) { alert (name); }
	 *     });
	 */
	self.init = function (routes) {
		var History = window.History;
		if (! History.enabled) {
			return false;
		}

		// set the routes
		self.set_routes (routes);

		// handle statechange events
		History.Adapter.bind (window, 'statechange', self.on_statechange);

		// catch all local click events
		$('body').on ('click', "a[href^='/']", self.click_handler);

		// kick us off with the current url
		self.route (window.location.href);
	};
	
	return self;
})(jQuery);