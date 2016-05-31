"use strict";
mainApp.controller('ListCtrl', ['$scope','$http', '$window', '$timeout', '$rootScope','dataStorageService', 'visibilityService', 'serverStatusService', function ($scope, $http,$window, $timeout, $rootScope, dataStorageService, visibilityService, serverStatusService) {
	$scope.start = 0;
	$scope.page = 50;

	$scope.mainImage= null;
	$scope.latest=[];
	$scope.dataService = dataStorageService;
	var storedCollection ,galleriesNeedsToUpdate = [];
	var iframe;
	var MAX_PARALLEL_IMAGE_DUMP = 100;
	var MAX_SEQUENTIAL_GET = 40;
	var getCounter = 0;
	var unregisterDataService;
	var errorCount = 0;
	$scope.loadingItem = null;

	$scope.notAllLoaded = function(item){
		return item.updates>(item.galleries?(item.galleries.length-1):-1);
	}
	$scope.get = function(item){
		//getting galleries iframe
		//iframe.contentWindow.stop();
		//$scope.itemValidation = "client_multi.html?updates="+updates+"&src="+src+"&server="+server+"&rnd="+Math.random();
		//getting galleries remote
		$scope.loadingItem = item;
		
		console.log(item);
		errorCount = 0;
		doBatchLoading(0,item.updates,item.src,item.server);
		
	}
	$scope.itemLoading = function(item){
		return item === $scope.loadingItem;
	}
	function doBatchLoading(start, updates,src,server){
		var host = 'http://mityok.hostfree.pw/sc/';
		var host = 'http://mityok.byethost4.com/sc/';
		var host = 'http://mityok.rf.gd/sc/';
		//var host = 'http://mityok.xp3.biz/sc/';
		//var host = 'http://mityok.freehost.tech/sc/';
		//var host = 'http://mityok.esy.es/sc/';//max seq needs to be low, doesn't work well with large requests
		//host = 'remote/';
		$http({method: 'GET', withCredentials: true, url: host+'trigger_seq_offload.php?href='+$rootScope.currentUser+'&n='+src+'&s='+server+'&l='+updates+'&b='+start+'&p='+MAX_SEQUENTIAL_GET+'&rnd='+Math.random()}).
		then(function(response) {
			// 0 50
			console.log(response.data.time, response.data.list,response.data.src,response.data.server,response.data.limit,response.data.start);
			var item = dataStorageService.getSelectedItem(response.data.src,response.data.server);
			if(!item){
				return;
			}
			if(!item.galleries || response.data.start === 0){
				item.galleries = [];
			}
			item.galleries = item.galleries.concat(response.data.list);
			//
			var filtered = item.galleries.filter(function(value){return value != null;});
			console.log(filtered.length+"/"+item.updates);
			dataStorageService.setDebounceData(8000);
			if(response.data.start+MAX_SEQUENTIAL_GET<response.data.limit){
				errorCount = 0;
				doBatchLoading(response.data.start+MAX_SEQUENTIAL_GET,response.data.limit,response.data.src,response.data.server);
			}else{
				$scope.loadingItem = null;
			}
        }, function(response) {
			errorCount++;
			if(errorCount<5){
				doBatchLoading(start,updates,src,server);
			}else{
				$scope.loadingItem = null;
				console.log('too many errors');
			}
			console.log(response);
		});
	}
	function clipPage(arr, start, limit){
		var sum = 0;
		for (var i = start; i < arr.length; i++) {
			sum += arr[i];
			if (sum >= limit) {
				return i- start;
			}
		}
		return arr.length;
	}
	$scope.gallerieReduce = function(galleries){
		if(!galleries){
			return -1;
		}
		return galleries.filter(function(value){return value != null;}).length;
	}
	/*
	$scope.dump = function(src,server,galleries){
		//TODO: set max to 200 units
		var total = galleries.reduce(function(a, b) {return a + b;});
		
		console.log(total);
		var page = 0;
		if(total >= MAX_PARALLEL_IMAGE_DUMP){
			page = clipPage(galleries,0,MAX_PARALLEL_IMAGE_DUMP);
		}
		console.log('page',page);
		$http({method: 'POST', url: 'server/multi_image_get.php?s='+src+"&r="+server+"&t="+1+"&p="+page, data: galleries, cache: false}).
		then(function(response) {
			console.log(response);
        }, function(response) {
			console.log(response);
		});
	}
	*/
	
	$scope.prev = function(){
		$scope.start-=$scope.page;
		spliceList();
	}
	$scope.next = function(){
		$scope.start+=$scope.page;
		spliceList();
	}
	$scope.stopIframe = function(){
		iframe.contentWindow.stop();
	}
	$scope.hover = function(src, server, updates){
		if(typeof server != 'undefined' && typeof src != 'undefined' && typeof updates != 'undefined'){
			if(updates>=3){
				for(var i=0;i<3;i++){
					$scope.latest[i]="server/get_gallery_thumb.php?s="+server+ "&n="+src+"&g="+(updates-i)+"&c="+1+"&m="+0;
				}
			}
		}else{
			var empty = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
			for(var i=0;i<3;i++){
					$scope.latest[i]=empty;
				}
		}
	}
	$scope.exclude = function(item){
		item.excluded = true;
		spliceList();
		dataStorageService.setDebounceData(0,true);
	}

	//pagination split
	function spliceList(){
		$scope.list = $scope.collection.slice($scope.start,$scope.start + $scope.page);
	}
	
	/*
	function loadNext() {
		console.log('loading next');
		getCounter++;
		if(getCounter<$scope.collection.length ){
			var item = $scope.collection[getCounter];
			if( item.galleries && item.galleries.length>0){
				loadNext();
			}else{
				if(!item.excluded){
					$scope.get(item.updates,item.src,item.server);
				}
			}
		}
	}
	*/
	function checkIfNeedsToUpdate() {
		if(galleriesNeedsToUpdate.length>0){
			console.log('galleriesNeedsToUpdate');
			console.log(JSON.stringify(galleriesNeedsToUpdate));
		}else{
			console.log('no galleriesNeedsToUpdate');
			
		}
	}
	
	(function init(){
		document.title = "This is the new page title.";		
		unregisterDataService = $scope.$watch('dataService.getData()', function(newVal) {
			if(newVal){
				$scope.collection = newVal;
				$scope.total= $scope.collection.length;
				spliceList();
			}
		});
	})();
	$scope.$on('$destroy', function () {
		unregisterDataService();
	});
}]);