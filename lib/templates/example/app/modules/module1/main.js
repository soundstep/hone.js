(function(ns) {
	
	ns.Module1 = function() {
		console.log('Module 1 created');
		
		require(['jquery', 'text!module1/views/view1.html'], function($, view) {
			$('#modules').append(view);
		});
		
	}
	
	if (typeof define === 'function' && define.amd) {
	   define(function() { return ns.Module1; });
	}
	
})(this['ns'] = this['ns'] || {});
