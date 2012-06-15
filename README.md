hone.js
=======

html, javascript and css optimization.
Build on top of r.js and using clean-css and html compressor.

The library will parse a folder (containing your html, javascript and css) to generate a folder containing the optimized content:

- javascript concatenate and minified
- css concatenate and minified
- html compressed

r.js is using a build file which I slightly extended.

Even if AMD module are really great, you do not need to use AMD modules, r.js is using uglifyjs and can minify your javascript regardless.

## installation from a terminal

You will need npm and node.js to install and run the hone.js.

	sudo npm -g install hone.js

## usage

	hone create my-app
	cd my-app
	hone build

You can also create a more complex example (with AMD modules) this way:

	hone create my-app -t example
	cd my-app
	hone build

## options

If you don't want to compress the html:

	hone build --skiphtml

If you don't want to minify the css:

	hone build --skipcss

See the help:

	hone -h

See the version:

	hone -v
	
## structure

	- my-app --> root
	     |-- app --> contain your application: html, css, js, and so on
	     |-- build/build.json --> describe the content to optimize the application
		 |-- public --> generated on the first build from the app folder, contains the optimized files

## build.json

The build.json file is an extension of the build used by r.js.
The property minCss has been added to list the css to minify, here is a simple example:

	{
	    "appDir": "../app",
	    "baseUrl": "./",
	    "dir": "../public",
		"minCss": [
			"styles/styles-home.css"
		]
	}

And here is a more complex example with AMD modules:

	{
		"appDir": "../app",
	    "baseUrl": "./",
	    "dir": "../public",
		"minCss": [
			"styles/styles-home.css",
			"styles/styles-page.css"
		],
		"paths": {
			"text":		"js/libs/text",
			"jquery":	"js/libs/jquery-1.7.2.min",
			"module1": 	"modules/module1",
			"module2": 	"modules/module2"
		},
		"modules": [
			{
				"name": "js/app"
			},
			{
				"name": "js/app-page"
			}
	    ]
	}

More info there:

- [r.js repo](https://github.com/jrburke/r.js/)
- [r.js info](http://requirejs.org/docs/optimization.html)

## css

You can use @import in css files to concatenate css files:

	@import url('./shared.css');

	body {
		background: #F7ECDC;
	}

Clean-css is used to minify the css.
The css files to minify can be listed in the build.json, see example above.

- [clean-css](https://github.com/GoalSmashers/clean-css)

## html

HTML compressor is used to compressed the html:

- [html compressor/](http://code.google.com/p/htmlcompressor/)







