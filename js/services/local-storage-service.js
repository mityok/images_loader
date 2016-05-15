'use strict';

mainApp.service('localStorageService',function(){
	function parse(type) {
		return typeof type == 'string' ? JSON.parse(type) : null;
	}
	this.clearCollection = function (key){
		localStorage.removeItem(key);
	}
	function isPresent(value, array){
		if(typeof value === 'string'){
			return array.indexOf(value);
		}else if('name' in value){
			for(var i=0;i<array.length;i++){
				if(array[i].name === value.name){
					return i;
				}
			}
		}else{
			for(var i=0;i<array.length;i++){
				var arrayKey = Object.keys(array[i])[0]; 
				var valueKey = Object.keys(value)[0]; 
				if(arrayKey === valueKey){
					return i;
				}
			}
		}
		return -1;
	}
	this.getKey = function(key){
		return parse(localStorage[key]);
	}
	this.setKey = function(key, value){
		return localStorage[key] = JSON.stringify(value);
	}
	this.addKey = function(key, value /* {name:xxx,data:[...]} */){
		var collection = null;
		if(!localStorage[key]){
			collection = [];
		}else{
			collection = parse(localStorage[key]);
		}
		if(value){
			var pos = isPresent(value, collection);
			if(pos >= 0){
				collection[pos] = value;
			}else{
				collection.push(value);
			}
		}
		localStorage[key] = JSON.stringify(collection);
		return collection;
	}
});