(function(ns) {
	
	ns.Module2 = function() {
		console.log('Module 2 created');
		
		require(['jquery', 'text!module2/views/view1.html'], function($, view) {
			$('#modules').append(view);
		});
		
	}
	
	if (typeof define === 'function' && define.amd) {
	   define(function() { return ns.Module2; });
	}
	
})(this['ns'] = this['ns'] || {});
