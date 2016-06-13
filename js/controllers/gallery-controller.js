"use strict";
mainApp.controller('GalleryCtrl', ['$scope','$http', '$routeParams', '$timeout',  '$window', '$rootScope', 'dataStorageService','$location', 'notificationService', 'TOAST_LENGTH_LONG', 'TOAST_TYPE_ERROR',function ($scope, $http, $routeParams,  $timeout, $window, $rootScope, dataStorageService, $location, notificationService, TOAST_LENGTH_LONG, TOAST_TYPE_ERROR) {
	$scope.itemId = $routeParams.itemId;
	$scope.serverId = $routeParams.serverId;
	$scope.nextImageOpacity = false;
	$scope.counter = 0;
	var markGallery = {};
	var playTimer = null; 
	var selectedItem = dataStorageService.getSelectedItem($scope.itemId,$scope.serverId);
	console.log(selectedItem);
	$rootScope.inGallery=true;
	function onKeyPress(e) {
		if (e.keyCode == '37') {
		   $scope.prevImage();
		}
		else if (e.keyCode == '39') {
		   $scope.nextImage();
		}	
		$scope.$apply();
	}
	(function init(){
		angular.element($window).on('keydown ', onKeyPress);
		dataStorageService.getStoredFoldeData($scope.itemId,$scope.serverId).then(function(response){
			$scope.collection = response.files;
			$scope.folder = response.folder;
			$scope.counter = 0;
			$scope.firstImage = $scope.folder+$scope.collection[0];
			getCurrentImageInfo();
		},function(){
			$location.path('/list/'+$scope.itemId+'/'+$scope.serverId+'/'+selectedItem.updates);
			notificationService.show('No images to show, returning to list view',TOAST_TYPE_ERROR, TOAST_LENGTH_LONG);
		})
		
	})();
	$scope.togglePlay = function(){
		$scope.playing = !$scope.playing;
		if($scope.playing){
			$scope.nextImage();
		}
	}
	
	$scope.back = function(){
		if(selectedItem){
			$location.path('/list/'+$scope.itemId+'/'+$scope.serverId+'/'+selectedItem.updates);
		}
	}
	$scope.prevImage = function(){
		//cancelTimeout();
		var prev = $scope.counter-1;
		var curr = $scope.counter;
		//console.log(curr,prev);
		if(prev<0){
			curr = 0;
			prev = $scope.collection.length-1;
			$scope.counter=$scope.collection.length;
			//console.log(curr,prev,$scope.counter);
		}
		$scope.counter--;
		rearange(curr,prev);
		$scope.nextImageOpacity = false;
		$timeout(function(){
			$scope.nextImageOpacity = true;
			getCurrentImageInfo();
		});
	};
	
	$scope.nextImage = function(){
		//cancelTimeout();
		var next = $scope.counter+1;
		var curr = $scope.counter;
		if(next>$scope.collection.length-1){
			curr = $scope.collection.length-1;
			next = 0;
			$scope.counter=-1;
		}
		$scope.counter++;
		rearange(curr,next);
		$scope.nextImageOpacity = false;
		$timeout(function(){
			$scope.nextImageOpacity = true;
			getCurrentImageInfo();
			switchImage();
		});
	};
	function rearange(c0,c1){
		$scope.firstImage = $scope.folder+$scope.collection[c0];
		$scope.secondImage = $scope.folder+$scope.collection[c1];
		//console.log('rearange',$scope.firstImage,$scope.secondImage);
	}
	function getCurrentImageInfo(){
		var match = $scope.collection[$scope.counter].match(/\d+/g);
		$scope.gallery = parseInt(match[0]);
		$scope.image = parseInt(match[1]);
		//if not viewed don't mark
		if(!$rootScope.imgShow){
			return;
		}
		if(!markGallery[$scope.gallery]){
			markGallery[$scope.gallery]=[];
		}
		markGallery[$scope.gallery][$scope.image] = true;
		
		var totalImagesInGallery = selectedItem.galleries[$scope.gallery];
		var sum=0;
		for(var i=0;i<markGallery[$scope.gallery].length;i++){
			if(markGallery[$scope.gallery][i]){
				sum++;
			}
		}
		if(sum === totalImagesInGallery){
			if(!selectedItem.viewed){
				selectedItem.viewed = []
			}
			selectedItem.viewed.push($scope.gallery);
			dataStorageService.setDebounceData(0,true);
		}
	}
	function switchImage(){
		if($scope.playing){
			if(playTimer){
				$timeout.cancel(playTimer);
				playTimer = null;
			}
			playTimer = $timeout(function(){
				if($scope.playing){
					$scope.nextImage();
				}
			},3000);
		}
	}
	$scope.$on('$destroy', function () {
$rootScope.inGallery=false;
		$timeout.cancel(playTimer);
		angular.element($window).off('keydown ', onKeyPress);
	});

	
}]);