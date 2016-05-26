"use strict";
mainApp.controller('ListInfoCtrl', ['$scope', '$routeParams', '$http', function ($scope, $routeParams, $http) {
	$scope.itemId = $routeParams.itemId;
	$scope.serverId = $routeParams.serverId;
	$scope.updates = $routeParams.updates;
	var pagination = 30;
	$scope.maxItems = pagination;
	$scope.start=1;
	//470
	$scope.arr=[null,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,18,9,23,12,20,13,15,17,9,14,36,16,7,12,14,15,15,9,4,11,18,23,15,14,12,7,13,20,8,10,4,16,2,7,31,16,24,78,14,7,10,6,6,15,3,14,16,19,6,6,15,10,18,25,14,20,10,4,43,20,26,5,5,11,14,10,55,19,13,19,9,30,17,15,12,10,1,1,15,18,17,7,13,10,50,29,19,27,20,20,24,20,23,30,14,25,25,7,16,26,27,20,73,13,19,62,17,15,15,10,10,25,18,20,12,14,67,10,10,4,10,20,5,10,14,16,8,44,11,9,5,15,15,15,5,20,10,20,8,10,15,5,10,15,20,9,10,18,24,9,10,15,20,10,15,18,10,10,24,10,10,10,4,25,15,30,14,15,13,12,29,10,10,20,15,14,9,17,10,20,10,15,12,14,20,3,25,15,17,14,15,9,5,23,14,24,25,10,10,10,10,10,15,10,20,20,15,14,12,15,5,15,15,20,13,9,9,15,18,25,20,15,25,13,20,15,20,15,20,9,20,10,13,12,15,11,13,23,18,15,19,14,23,10,35,10,10,24,15,13,15,25,14,5,40,18,12,15,20,15,14,19,40,15,10,9,25,15,45,15,15,5,13,12,15,5,5,25,20,20,10,22,20,25,12,29,12,25,14,37,30,14,15,5,10,20,54,18,15,20,15,20,20,28,25,15,20,15,19,10,20,10,24,20,15,10,14,19,17,9,10,14,10,15,10,15,15,14,5,19,39,13,14,20,19,15,14,20,19,15,20,14,12,15,13,15,20,15,13,15,10,29,10,15,15,33,10,15,15,18,20,28,28,15,13,19,10,15,15,28,20,20,20,19,13,10,9,25,14,13,14,18,14,9,25,10,10,10,14,14,25,14,17,13,17,8,10,9,15,10,15,9,5,10,13,14,15,5,9,13,5,10,10,10,14,15,10,5,12,20,14,45,8,10,17,18,9,10,10,10,10,10,10,13,15,8,10,8,38,10,22,20,15,5,20,5,15,15,10,10,10,15,12,10,10];
	$scope.files=[];
	$scope.start = getValidStart();
	$scope.list = [];
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