'use strict';
mainApp.service('stateService',function(){
	var state ={};
	function addKey(key, value){
		state[key] = value;
	}
	function getKey(key){
		return state[key];
	}
	this.getKey = getKey;
	this.addKey = addKey;
});