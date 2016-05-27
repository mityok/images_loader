"use strict";
mainApp.controller('ListInfoCtrl', ['$scope', '$routeParams', '$http', 'dataStorageService', function ($scope, $routeParams, $http, dataStorageService ) {
	$scope.itemId = $routeParams.itemId;
	$scope.serverId = $routeParams.serverId;
	$scope.updates = $routeParams.updates;
	var pagination = 30;
	$scope.maxItems = pagination;
	$scope.start = 1;
	//470
	$scope.files=[];
	$scope.list = [];
	$scope.arr = dataStorageService.getSelectedItem($scope.itemId,$scope.serverId).galleries;
	$scope.start = getValidStart();
	createList();
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
	function createList(){
		$scope.list = [];
		for(var i = $scope.start;i<$scope.start+$scope.maxItems;i++){
			$scope.list.push(i);
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
		createList();
	}
}]);