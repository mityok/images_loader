'use strict';

mainApp.service('dataStorageService',function($http, $q){
	var list = null;
	
	this.loadFromNet = function(){
		$http({method: 'GET', url: 'server/exist_multi_start.php', cache: false}).
        then(function(response) {
			
			//$scope.collection = response.data.items.filter(isIncluded);
			//$scope.total = $scope.collection.length;
			//
			//checkIfNeedsToUpdate();
			//
			spliceList();
        }, function(response) {
			console.log(response);
		});
	}
	this.getData = function(){
		return list;
	}
	this.getStoredData = function(){
		if(list && list.length>0){
			console.log('has list');
			return $q.when(list);
		}
		
		return $http({method: 'GET', url: 'server/read_post.php'}).
		then(function(response) {
			console.log('getting list');
			list = response.data.data;
			return list;
        }, function(response) {
			console.log(response);
			return null;
		});
	}
	this.setData = function(){
		return $http({method: 'POST', url: 'server/write_post.php', data: list}).
			then(function(response) {
				return response;
			}, function(response) {
				return response;
			});
	}
	this.setDebounceData = function(wait, immediate){
		var _this = this;
		this.debounce(function(){
			_this.setData();
		}, wait,immediate)();
	}
	this.getSelectedItem=function(src,server){
		if(!list){
			return null;
		}

		return list.filter(function(item){
			return item.src == src && server == item.server;
		})[0];
	}
	this.debounce = function(func, wait, immediate) {
		var timeout;
		return function() {
			var context = this, args = arguments;
			var later = function() {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	};
});