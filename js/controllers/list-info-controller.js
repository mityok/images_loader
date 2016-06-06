"use strict";
mainApp.controller('ListInfoCtrl', ['$scope', '$routeParams', '$http', '$timeout', '$location', 'dataStorageService', 'stateService', function ($scope, $routeParams, $http, $timeout, $location, dataStorageService, stateService ) {
	$scope.itemId = $routeParams.itemId;
	$scope.serverId = $routeParams.serverId;
	$scope.updates = $routeParams.updates;
	var pagination = 30;
	//470
	$scope.files = {};
	$scope.store = [];
	var selectedItem = dataStorageService.getSelectedItem($scope.itemId,$scope.serverId);
	if(!selectedItem || selectedItem.excluded){
		$location.path('/list');
		return;
	}
	$scope.arr = selectedItem.galleries;
	$scope.start = getValidStart();
	$scope.maxItems = stateService.getKey(getStateKey()) || Math.min($scope.arr.length - $scope.start ,pagination);
	$scope.currentLoadingGalleries = [];
	$scope.initialLoad=false;
	//[0,0,0,1,2,3,4,5]	len = 8 , start = 3 maxItems = 5
	console.log($scope.maxItems);
	createStore();
	getImagesStore($scope.itemId, $scope.serverId);
	function getStateKey(){
		return $scope.itemId+$scope.serverId+'maxItems';
	}
	function getImagesStore(src, server){
		$http({method: 'POST', url: 'server/folder_scan.php?s='+src+"&r="+server, data: $scope.arr, cache: false}).
		then(function successCallback(response) {
			console.log(response.data);
			if(response.data.message=="error"){
				console.log('error');
			}else{
				$scope.files = response.data.files;
			}
			$scope.sum = 0;
			for( var el in $scope.files ) {
				$scope.sum += $scope.files[el];
			}
			console.log($scope.sum);
			$scope.initialLoad = true;
        }, function errorCallback(response) {
			console.log(response.data);
			$scope.initialLoad = true;
		});
		
	}
	function getValidStart(){
		for(var i = 0;i<$scope.arr.length;i++){
			if($scope.arr[i]){
				return i;
			}
		}
		return -1;
	}
	function createStore(){
		$scope.store = [];
		for(var i = $scope.start;i<$scope.start+$scope.maxItems;i++){
			$scope.store.push(i);
		}
	}

	$scope.getGallery = function(src,server,count,i){
		if($scope.currentLoadingGalleries.indexOf(i)==-1){
			$scope.currentLoadingGalleries.push(i);
		}
		$http({method: 'POST', url: 'server/multi_image_get.php?s='+src+"&r="+server+"&t="+i+"&p="+1, data: $scope.arr, cache: false}).
		then(function(response) {
			if(response.data.message == "ok"){
				$timeout(function(){
					getImagesStore($scope.itemId, $scope.serverId);
				},100);
			}
			loadingDone(i);
			console.log(response.data);
        }, function(response) {
			console.log(response.data);
			loadingDone(i);
		});
	}
	function loadingDone(index){
		var pos = $scope.currentLoadingGalleries.indexOf(index);
		if(pos>-1){
			$scope.currentLoadingGalleries.splice(pos,1);
		}
	}
	$scope.toggleVisible = function(i){
		if(selectedItem.viewed && selectedItem.viewed.indexOf(i)>=0){
			var pos = selectedItem.viewed.indexOf(i)
			selectedItem.viewed.splice(selectedItem.viewed.indexOf(i),1);
		}else if(!selectedItem.viewed){
			selectedItem.viewed=[i];
		}else{	
			selectedItem.viewed.push(i);
		}
		dataStorageService.setDebounceData(0,true);
	}
	$scope.isViewed = function(i){
		return selectedItem.viewed && selectedItem.viewed.indexOf(i)>=0;
	}
	$scope.more = function(){
		$scope.maxItems += pagination;
		stateService.addKey(getStateKey(),$scope.maxItems);
		createStore();
	}
}]);