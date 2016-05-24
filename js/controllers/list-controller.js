"use strict";
mainApp.controller('ListCtrl', ['$scope','$http', '$window', '$timeout', function ($scope, $http,$window, $timeout) {
	$scope.start = 0;
	$scope.page = 50;
	$scope.itemValidation;
	$scope.mainImage= null;
	$scope.latest=[];
	var storedCollection ,galleriesNeedsToUpdate = [];
	var iframe;
	var MAX_PARALLEL_IMAGE_DUMP = 100;
	var getCounter = 0;
	$scope.get = function(updates,src,server){
		iframe.contentWindow.stop();
		//getting galleries
		$scope.itemValidation = "client_multi.html?updates="+updates+"&src="+src+"&server="+server+"&rnd="+Math.random();
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
	$scope.dump = function(src,server,galleries){
		//TODO: set max to 200 units
		//var total = galleries.reduce(function(a, b) {return a + b;});
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
	$scope.loadPreloadedGalleries = function(){
		$http({method: 'GET', url: 'server/read_post.php', data: $scope.collection}).
		then(function(response) {
			$scope.collection = response.data.data;
			spliceList();
        }, function(response) {
			console.log(response);
		});
	}
	$scope.dropPreloadedGalleries = function(){
		myEfficientFn();
	}
	var myEfficientFn = debounce(function() {
			$http({method: 'POST', url: 'server/write_post.php', data: $scope.collection}).
			then(function(response) {
				console.log(response);
			}, function(response) {
				console.log(response);
			});
		}, 5000);
	function debounce(func, wait, immediate) {
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
	$scope.clearSession = function(){
		$http({method: 'GET', url: 'server/test_proxy.php?c=1', cache: false});
		
	}
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
		$scope.dropPreloadedGalleries();
	}

	//pagination split
	function spliceList(){
		$scope.list = $scope.collection.slice($scope.start,$scope.start + $scope.page);
	}
	function onMessage(e){
		if(!e.data){
			return;
		}
		var info = JSON.parse(e.data);
		if(info.type ==="progress"){
			//console.log("message",info.data);
			var item = $scope.collection.filter(function(value){
				return value.src == info.data.src && info.data.server == value.server;
			})[0];
			if(!item){
				return;
			}
			if(!item.galleries){
				item.galleries = [];
			}
			item.galleries[info.data.position] = info.data.limit;
			$scope.dropPreloadedGalleries();
			//console.log("message2",$scope.item);
			/*
			if(!$scope.galleries[info.data.src+"_"+info.data.server]){
				$scope.galleries[info.data.src+"_"+info.data.server]=[];
			}
			$scope.galleries[info.data.src+"_"+info.data.server][info.data.position] = info.data.limit;
			*/
			//var obj = {};
			//obj[info.data.src+"_"+info.data.server]=$scope.galleries[info.data.src+"_"+info.data.server];
			//localStorageService.addKey('galleries',obj);
		}else if(info.type === "loaded"){
			console.log('loaded',getCounter);
			$timeout(loadNext,3000);
			loadNext();
			
			//console.log('gal',$scope.galleries);
		}
		//iframe.contentWindow.stop();
		$scope.$apply();
	}
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
	function onKeyPress(e) {
		console.log(e,String.fromCharCode(e.keyCode));
		if(e.code == 'KeyH'){
			$scope.imgShow = !$scope.imgShow;
		}
		$scope.$apply();
	}
	/*
	function getGalleries() {
		var galleries =  localStorageService.getKey('galleries');
		//put loaded galeries
		if(galleries){
			for(var i = 0; i < galleries.length; i++){
				var valueKey = Object.keys(galleries[i])[0]; 
				$scope.galleries[valueKey] = galleries[i][valueKey];
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
	function isIncluded(value) {
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
		value.updates = parseInt(value.updates);
		//
		if(storedCollection){
			for (var i=0;i<storedCollection.length;i++){
				if(storedCollection[i].src === value.src && storedCollection[i].server === value.server){
					var storedDate = new Date(storedCollection[i].date);
					if(Math.abs(value.date.getTime() - storedDate.getTime())>1000 * 3600 * 12 || value.updates > storedCollection[i].updates){
						galleriesNeedsToUpdate.push(value);
					}
				}
			}
		}
		//
		return !value.excluded;
	}
	(function init(){
		angular.element($window).on('message', onMessage);
		angular.element($window).on('keypress', onKeyPress);
		iframe = document.getElementById('frm');
		//
		//getGalleries();
		//
		$http({method: 'GET', url: 'server/exist_multi_start.php', cache: false}).
        then(function(response) {
			
			$scope.collection = response.data.items.filter(isIncluded);
			$scope.total = $scope.collection.length;
			//
			checkIfNeedsToUpdate();
			//
			//localStorageService.setKey('collection',$scope.collection);
			//
			spliceList();
        }, function(response) {
			console.log(response);
		});
	})();
	$scope.$on('$destroy', function () {
		angular.element($window).off('message', onMessage);
		angular.element($window).off('keypress', onKeyPress);
	});
}]);