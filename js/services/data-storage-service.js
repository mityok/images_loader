'use strict';

mainApp.service('dataStorageService',function($http, $q){
	var list = null;
	var date = null;
	var filesCollection = null;
	var folderLocation = null;
	function updateValues(value) {
		var dt = new Date();
		if(value.date.toUpperCase() === 'TODAY'){
			value.date = dt;
		}else if(value.date.toUpperCase() === 'YESTERDAY'){
			dt.setDate(dt.getDate() - 1);
			value.date = dt;
		}else if(value.date.toUpperCase() === 'NEW'){
			value.date = new Date("Jan 1 1970");
		}else{
			value.date = new Date(value.date);
		}
		//some times updates have 1 item less
		value.updates = parseInt(value.updates);
		//
	}
	this.getStoredFoldeData = function(itemId,serverId){
		if( folderLocation && filesCollection && filesCollection.length>0){
			console.log('has list');
			return $q.when({files:filesCollection,folder:folderLocation});
		}
		return this.getFolderData(itemId,serverId).then(function(){
			return {files:filesCollection,folder:folderLocation};
			})
		
	}
	this.getFolderData = function(itemId,serverId){
		var that = this;
		var selectedItem = that.getSelectedItem(itemId,serverId);
		return $http({method: 'GET', url: 'server/read_folder.php?q='+itemId+'&r='+serverId, cache: false}).
        then(function(response) {
			if(response.data.message){
				console.log(response.data.message);
				return $q.reject('no data: '+ data.message);
			}
			function isIncluded(value) {
				//     /^(ra)([0-9]){0,}x([0-9]){0,}\.(jpg)$/g
				// ra4x001.jpg
				var regexp = new RegExp('^('+itemId.substr(0,2)+')([0-9]){0,}x([0-9]){0,}\.(jpg)$', "g");
				var myArray = value.match(regexp);
				
				if(myArray){
					var match = value.match(/\d+/g);
					if(match && match[0] && selectedItem && selectedItem.viewed){
						//don't return if viewed
						return selectedItem.viewed.indexOf(parseInt(match[0]))==-1;
					}
					return true;
				}
				return false;
			}
			filesCollection = response.data.files.filter(isIncluded);
			folderLocation = response.data.folder+'/';
			if(!filesCollection || filesCollection.length ===0){			
				return $q.reject('no data');
			}
        }, function(response) {
			return $q.reject(response.data);
		});
	}
	this.loadFromNet = function(){
		var that = this;
		$http({method: 'GET', url: 'server/exist_multi_start.php', cache: false}).
        then(function(response) {
			var items = response.data.items;
			console.log(items);
			for(var i = 0;i < items.length; i++){
				updateValues(items[i]);
				var selectedItem = that.getSelectedItem(items[i].src, items[i].server);
				if(selectedItem){
					if(items[i].updates > selectedItem.updates){
						selectedItem.updates = items[i].updates;
						selectedItem.date = items[i].date;
						console.log('larger',selectedItem,items[i]);
					}
				}else{
					list.push(items[i]);
					console.log('new',items[i]);
				}
			}
			date = new Date();
			//$scope.collection = response.data.items.filter(isIncluded);
			//$scope.total = $scope.collection.length;
			//
			//checkIfNeedsToUpdate();
			//
        }, function(response) {
			console.log(response);
		});
	}
	this.getTime = function(){
		return date;
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
			console.log('getting list & stuff',response.data.data);
			if(angular.isArray(response.data.data)){
				list = response.data.data;
			}else{
				list = response.data.data.list;
				date = new Date(response.data.data.time);
			}
			return list;
        }, function(response) {
			console.log(response);
			return null;
		});
	}
	this.setData = function(){
		return $http({method: 'POST', url: 'server/write_post.php', data: {'list':list,'time':date}}).
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
	this.getSelectedItem = function(src,server){
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