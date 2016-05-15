"use strict";
mainApp.controller('ListCtrl', ['$scope','$http', 'localStorageService', '$window', function ($scope, $http, localStorageService,$window) {
	$scope.start = 0;
	$scope.page = 50;
	$scope.itemValidation;
	$scope.galleries = {};
	$scope.mainImage= null;
	$scope.latest=[];
	var storedCollection ,galleriesNeedsToUpdate = [];
	var excluded;
	var iframe;
	$scope.get = function(updates,src,server){
		iframe.contentWindow.stop();
		$scope.itemValidation = "client_multi.html?updates="+updates+"&src="+src+"&server="+server+"&rnd="+Math.random();
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
			$scope.mainImage = "get_main_thumb.php?s="+server+ "&n="+src;
			if(updates>=3){
				for(var i=0;i<3;i++){
					$scope.latest[i]="get_gallery_thumb.php?s="+server+ "&n="+src+"&g="+(updates-i)+"&c="+1;
				}
			}
		}else{
			var empty = "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=";
			$scope.mainImage = empty;
			for(var i=0;i<3;i++){
					$scope.latest[i]=empty;
				}
		}
	}
	$scope.exclude = function(src, server){
		localStorageService.addKey('exclude',src+'_'+server);
	}
	$scope.send = function(){
		console.log(localStorageService.getSelected());
	};
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
			console.log("message",info.data);
			if(!$scope.galleries[info.data.src+"_"+info.data.server]){
				$scope.galleries[info.data.src+"_"+info.data.server]=[];
			}
			$scope.galleries[info.data.src+"_"+info.data.server][info.data.position] = info.data.limit;
			var obj = {};
			obj[info.data.src+"_"+info.data.server]=$scope.galleries[info.data.src+"_"+info.data.server];
			localStorageService.addKey('galleries',obj);
		}else if(info.type === "loaded"){
			console.log('gal',$scope.galleries);
		}
		//iframe.contentWindow.stop();
		$scope.$apply();
	}
	
	function onKeyPress(e) {
		console.log(e,String.fromCharCode(e.keyCode));
		if(e.code == 'KeyH'){
			$scope.imgShow = !$scope.imgShow;
		}
		$scope.$apply();
	}
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
		if(!excluded){
			return true;
		}
		return excluded.indexOf(value.src+'_'+value.server) < 0;
	}
	(function init(){
		angular.element($window).on('message', onMessage);
		angular.element($window).on('keypress', onKeyPress);
		iframe = document.getElementById('frm');
		excluded = localStorageService.getKey('exclude');
		storedCollection = localStorageService.getKey('collection');
		//
		getGalleries();
		//
		$http({method: 'GET', url: 'exist_multi_start.php', cache: false}).
        then(function(response) {
			
			$scope.collection = response.data.items.filter(isIncluded);
			$scope.total = $scope.collection.length;
			//
			checkIfNeedsToUpdate();
			//
			localStorageService.setKey('collection',$scope.collection);
			//
			spliceList();
        }, function(response) {
			console.log(response);
		});
	})();
}]);