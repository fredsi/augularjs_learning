angular.module('todoApp').factory('todoStorage', function(){

	return {
		put: function(key, value) {
			if(window.localStorage){
				localStorage.setItem(key, JSON.stringify(value));
			}
		},
		get: function(key) {
			if(window.localStorage){
				return JSON.parse(localStorage.getItem(key) || "[]");	
			}
		}
	};
});