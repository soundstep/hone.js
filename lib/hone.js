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
	createProject:function (name, template) {
		hone.template = template || "app";
		console.log('I will create a project: ' + name, hone.template);
		console.log(__dirname);
		console.log(__filename);
		console.log(process.cwd());
		var baseDir = process.cwd();
		var projectDir = baseDir + '/' + name;
		if (path.existsSync(projectDir)) {
			console.log('Error: the directory "' + projectDir + '" already exists.');
		} else {
			// create project
			console.log('create a project: ' + name);
			wrench.copyDirSyncRecursive(__dirname + '/templates/' + hone.template, projectDir);
			console.log('project created in: ' + projectDir);
		}
	},
	validateProject: function() {
		console.log(__dirname);
		console.log(__filename);
		var projectDir = process.cwd();
		if (!path.existsSync(projectDir + "/build") || !path.existsSync(projectDir + "/build/build.json")) {
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
			console.log("optimize");
			hone.optimizeJs();
		}
	},
	optimizeJs: function() {
		if (hone.validateProject()) {
			// js
			var projectDir = process.cwd();
			console.log("project dir", projectDir);
			wrench.rmdirSyncRecursive(projectDir + '/public', true);
			var rjs = path.resolve(__dirname, "../node_modules/requirejs/bin/r.js");
			console.log("node", rjs, "-o", projectDir + "/build/build.json");
			var spawnJs = spawn("node", [rjs, "-o", projectDir + "/build/build.json"]);
			spawnJs.stdout.on('data', function (data) {
				process.stdout.write(data.toString());
			});
			spawnJs.on('exit', function (code) {
				hone.optimizeCss(true);
			});
		}
	},
	optimizeCss: function() {
		if (hone.validateProject()) {
			if (!hone.skipcss) {
				// css
				if (hone.config.hasOwnProperty('minCss')) {
					console.log("Start minifying css...");
					var projectDir = process.cwd();
					var css = path.resolve(__dirname, "../node_modules/clean-css/bin/cleancss");
					hone.config['minCss'].forEach(function(element, index) {
						var cssFile = path.resolve(projectDir + "/public/", element);
						console.log("minify css: " + cssFile);
						exec(css + " -o " + cssFile + " " + cssFile, function (error, stdout, stderr) {
							if (error !== null) {
								console.log('exec error: ' + error);
							}
						});
					});
					console.log("Minifying css success!");
				}
			}
			hone.optimizeHtml();
		}
	},
	optimizeHtml: function() {
		if (hone.validateProject()) {
			if (!hone.skiphtml) {
			// html
			console.log("Start minifying html...");
			var projectDir = process.cwd();
			var comp = __dirname + "/externals/htmlcompressor-1.5.3.jar";
			console.log("comp", comp);
			var files = wrench.readdirSyncRecursive(projectDir + "/public");
			files.forEach(function(element, index) {
				if (files[index].indexOf(".html") != -1 || files[index].indexOf(".htm") != -1) {
					console.log("minify: " + projectDir + "/public/" + files[index]);
					exec('java -jar ' + comp + " --type html --preserve-comments -o " + projectDir + "/public/" + files[index] + " " + projectDir + "/app/" + files[index]);
				}
			});
			console.log("Minifying html success!");
			}
		}
	}
}

module.exports = hone;
