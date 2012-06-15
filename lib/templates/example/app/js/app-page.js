;(function(ns, undefined) {
	
	require.config({
		baseUrl: './',
		paths: {
			text:		'js/libs/text',
			jquery:		'js/libs/jquery-1.7.2.min',
			module1: 	'modules/module1',
			module2: 	'modules/module2'
		}
	});
	
	require(["jquery"], function(s){
	
		ns.Application = function Application() {
			console.log("App created");
			var self = this;
			$('#m1').click(function() { self.loadModule('module1/main'); });
			$('#m2').click(function() { self.loadModule('module2/main'); });
		};

		ns.Application.prototype = {
			loadModule: function(moduleName) {
				require([moduleName], function(Module) {
					var module = new Module();
				});
			}
		};
		
		var app = new ns.Application();
        
    });
	
})(this['ns'] = this['ns'] || {});
