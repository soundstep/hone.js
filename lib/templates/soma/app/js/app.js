;(function(ns, undefined) {
	
	require.config({
		baseUrl: './',
		paths: {
			soma: 		'js/libs/soma',
			text:		'js/libs/text',
			jquery:		'js/libs/jquery-1.7.2.min',
			module1: 	'modules/module1',
			module2: 	'modules/module2'
		}
	});
	
	requirejs.onError = function (err) {
	    console.log(err.requireType);
	    if (err.requireType === 'timeout') {
	        console.log('modules: ' + err.requireModules);
	    }
	
	    throw err;
	};
	
	require(["soma", "jquery"], function(s){
	
		ns.SomaApplication = soma.Application.extend({

			init: function() {
				console.log("App created");
				$('#m1').click(function() { this.loadModule('module1/main'); }.bind(this));
				$('#m2').click(function() { this.loadModule('module2/main'); }.bind(this));
			},
			
			loadModule: function(moduleName) {
				require([moduleName], function(Module) {
					var module = new Module();
				});
			}

		});
		
		var app = new ns.SomaApplication();
        
    });
	
})(this['ns'] = this['ns'] || {});
