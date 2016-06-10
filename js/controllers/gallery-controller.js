"use strict";
mainApp.controller('GalleryCtrl', ['$scope','$http', '$routeParams', '$timeout',  '$window', '$rootScope', 'dataStorageService','$location',function ($scope, $http, $routeParams,  $timeout, $window, $rootScope, dataStorageService,$location) {
	$scope.itemId = $routeParams.itemId;
	$scope.serverId = $routeParams.serverId;
	$scope.nextImageOpacity = false;
	$scope.counter = 0;
	var markGallery = {};
	var playTimer = null; 
	var selectedItem = dataStorageService.getSelectedItem($scope.itemId,$scope.serverId);
	console.log(selectedItem);
	function isIncluded(value) {
		//     /^(ra)([0-9]){0,}x([0-9]){0,}\.(jpg)$/g
		// ra4x001.jpg
		var regexp = new RegExp('^('+$scope.itemId.substr(0,2)+')([0-9]){0,}x([0-9]){0,}\.(jpg)$', "g");
		var myArray = value.match(regexp);
		
		if(myArray){
			var match = value.match(/\d+/g);
			if(match && match[0] && selectedItem.viewed){
				//don't return if viewed
				return selectedItem.viewed.indexOf(parseInt(match[0]))==-1;
			}
			return true;
		}
		return false;
	}
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
		$http({method: 'GET', url: 'server/read_folder.php?q='+$scope.itemId+'&r='+$scope.serverId, cache: false}).
        then(function(response) {
			if(response.data.message){
				console.log(response.data.message);
				return;
			}
			$scope.collection = response.data.files.filter(isIncluded);
			$scope.folder = response.data.folder+'/';
			if(!$scope.collection || $scope.collection.length ===0){
				$location.path('/list/'+$scope.itemId+'/'+$scope.serverId+'/'+selectedItem.updates);
				return;
			}
			$scope.counter = 0;
			//console.log('init',$scope.firstImage,$scope.secondImage);
			$scope.firstImage = $scope.folder+$scope.collection[0];
			getCurrentImageInfo();
        }, function(response) {
			console.log(response);
		});
	})();
	$scope.togglePlay = function(){
		$scope.playing = !$scope.playing;
		if($scope.playing){
			$scope.nextImage();
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
		$timeout.cancel(playTimer);
		angular.element($window).off('keydown ', onKeyPress);
	});

	
}]);