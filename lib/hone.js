var fs = require('fs'),
	path = require('path'),
	wrench = require('wrench'),
	requirejs = require('requirejs'),
	spawn = require('child_process').spawn,
	exec = require('child_process').exec;

var hone = {
	skiphtml: false,
	skipcss: false,
	config: null,
	createApplication:function (name, template) {
		hone.template = template || "app";
		var baseDir = process.cwd();
		var projectDir = baseDir + '/' + name;
		if (fs.existsSync(projectDir)) {
			console.log('Error: the directory "' + projectDir + '" already exists.');
		} else {
			// create project
			wrench.copyDirSyncRecursive(__dirname + '/templates/' + hone.template, projectDir);
			console.log('Application created:', name + ", template:", hone.template + ", location:", projectDir);
		}
	},
	validateProject: function() {
		var projectDir = process.cwd();
		if (!fs.existsSync(projectDir + "/build") || !fs.existsSync(projectDir + "/build/build.json")) {
			console.log('Error: /build/build.json missing from "' + projectDir);
			return false;
		}
		else {
			if (!hone.config) {
				hone.config = JSON.parse(fs.readFileSync(projectDir + "/build/build.json", "utf-8"));
			}
			return true;
		}
	},
	build:function (skiphtml, skipcss) {
		hone.skiphtml = skiphtml;
		hone.skipcss = skipcss;
		if (hone.validateProject()) {
			console.log("> optimize application");
			hone.optimizeJs();
		}
	},
	optimizeJs: function() {
		if (hone.validateProject()) {
			console.log("> create public folder and optimize javascript...");
			// js
			var projectDir = process.cwd();
			wrench.rmdirSyncRecursive(projectDir + '/public', true);
			var rjs = path.resolve(__dirname, "../node_modules/requirejs/bin/r.js");
			var spawnJs = spawn("node", [rjs, "-o", projectDir + "/build/build.json"]);
			spawnJs.stdout.on('data', function (data) {
				process.stdout.write(data.toString());
			});
			spawnJs.on('exit', function (code) {
				console.log("> create public folder and optimize javascript success!\n");
				hone.optimizeCss(true);
			});
		}
	},
	optimizeCss: function() {
		if (hone.validateProject()) {
			if (!hone.skipcss) {
				// css
				if (hone.config.hasOwnProperty('minCss')) {
					console.log("> minify css...");
					var projectDir = process.cwd();
					var css = path.resolve(__dirname, "../node_modules/clean-css/bin/cleancss");
					hone.config['minCss'].forEach(function(element, index) {
						var cssFile = path.resolve(projectDir + "/public/", element);
						console.log(cssFile);
						exec(css + " -o " + cssFile + " " + cssFile, function (error, stdout, stderr) {
							if (error !== null) {
								console.log('exec error: ' + error);
							}
						});
					});
					console.log("> minify css success!\n");
				}
			}
			hone.optimizeHtml();
		}
	},
	optimizeHtml: function() {
		if (hone.validateProject()) {
			if (!hone.skiphtml) {
				// html
				console.log("> compress html...");
				var projectDir = process.cwd();
				var comp = __dirname + "/externals/htmlcompressor-1.5.3.jar";
				var files = wrench.readdirSyncRecursive(projectDir + "/public");
				files.forEach(function(element, index) {
					if (files[index].indexOf(".html") != -1 || files[index].indexOf(".htm") != -1) {
						console.log(projectDir + "/public/" + files[index]);
						exec('java -jar ' + comp + " --type html --preserve-comments -o " + projectDir + "/public/" + files[index] + " " + projectDir + "/app/" + files[index]);
					}
				});
				console.log("> compress html success!\n");
			}
			console.log("> optimization complete");
		}
	}
}

module.exports = hone;
