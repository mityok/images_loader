"use strict";
mainApp.controller('ListInfoCtrl', ['$scope', '$routeParams', '$http', 'dataStorageService', function ($scope, $routeParams, $http, dataStorageService ) {
	$scope.itemId = $routeParams.itemId;
	$scope.serverId = $routeParams.serverId;
	$scope.updates = $routeParams.updates;
	var pagination = 30;
	
	$scope.start = 1;
	//470
	$scope.files=[];
	$scope.store = [];
	$scope.arr = dataStorageService.getSelectedItem($scope.itemId,$scope.serverId).galleries;
	$scope.start = getValidStart();
	$scope.maxItems = Math.min($scope.arr.length - $scope.start ,pagination);
	//[0,0,0,1,2,3,4,5]	len = 8 , start = 3 maxItems = 5
	console.log($scope.maxItems);
	createStore();
	getImagesStore($scope.itemId, $scope.serverId);
	function getImagesStore(src, server){
		$http({method: 'POST', url: 'server/folder_scan.php?s='+src+"&r="+server, data: $scope.arr, cache: false}).
		then(function(response) {
			console.log(response);
			if(response.data.message=="error"){
				console.log('error');
			}else{
				$scope.files=response.data.files;
			}
        }, function(response) {
			console.log(response);
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
		$http({method: 'POST', url: 'server/multi_image_get.php?s='+src+"&r="+server+"&t="+i+"&p="+1, data: $scope.arr, cache: false}).
		then(function(response) {
			if(response.data.message=="ok"){
				getImagesStore($scope.itemId, $scope.serverId);
			}
			console.log(response);
        }, function(response) {
			console.log(response);
		});
		//$scope.files[i]=
	}
	$scope.more = function(){
		$scope.maxItems += pagination;
		createStore();
	}
}]);