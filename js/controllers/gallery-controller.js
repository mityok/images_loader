"use strict";
mainApp.controller('GalleryCtrl', ['$scope','$http', '$routeParams', '$location', '$timeout',  '$window', function ($scope, $http, $routeParams, $location, $timeout, $window) {
	$scope.itemId = $routeParams.itemId;
	$scope.serverId = $routeParams.serverId;
	$scope.nextImageOpacity = 1;
	$scope.counter = 0;
	var playTimer = null; 
	var fadeTimer = null; 
	function isIncluded(value) {
		//     /^(ra)([0-9]){0,}x([0-9]){0,}\.(jpg)$/g
		// ra4x001.jpg

		var regexp = new RegExp('^('+$scope.itemId.substr(0,2)+')([0-9]){0,}x([0-9]){0,}\.(jpg)$', "g");
		var myArray = value.match(regexp);
		return myArray!=null;
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
			/* mock start */
			//response.data={folder:'http://freelargephotos.com/',files:['705711_l.jpg','705712_l.jpg','705713_l.jpg','705714_l.jpg','705715_l.jpg','705716_l.jpg']}
			//response.data={folder:'http://freelargephotos.com/',files:['705711_l.jpg','705712_l.jpg']}
			//$scope.collection=response.data.files;
			/* mock end */
			$scope.collection = response.data.files.filter(isIncluded);
			$scope.folder = response.data.folder+'/';
			console.log($scope.folder,$scope.collection);
			$scope.counter = 0;
			$scope.firstImage = $scope.folder+$scope.collection[0];
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
	function cancelTimeout(){
		$timeout.cancel(playTimer);
		if($scope.nextImageOpacity<1 && $scope.nextImageOpacity>0){
			$timeout.cancel(fadeTimer);
			$scope.nextImageOpacity=1;
		}
	}
	$scope.prevImage = function(){
		cancelTimeout();
		var prev = $scope.counter-1;
		var curr = $scope.counter;
		if(prev<0){
			curr = 0;
			prev = $scope.collection.length-1;
			$scope.counter=$scope.collection.length;
		}
		rearange(curr,prev);
		$scope.counter--;
		playAnim();
		
	};
	
	$scope.nextImage = function(){
		cancelTimeout();
		var next = $scope.counter+1;
		var curr = $scope.counter;
		if(next>$scope.collection.length-1){
			curr = $scope.collection.length-1;
			next = 0;
			$scope.counter=-1;
		}
		rearange(curr,next);
		$scope.counter++;
		playAnim();
	};
	function rearange(c0,c1){
		$scope.firstImage = $scope.folder+$scope.collection[c0];
		$scope.secondImage = $scope.folder+$scope.collection[c1];
	}
	function switchImage(){
		//TODO: mark which gallery is already seen
		//console.log($scope.collection[$scope.counter],$scope.itemId,$scope.serverId);
		$scope.nextImageOpacity = 1;
		$scope.firstImage = $scope.folder+$scope.collection[$scope.counter];
		$scope.secondImage = $scope.folder+$scope.collection[$scope.counter+1];
		if($scope.playing){
			playTimer = $timeout(function(){
				if($scope.playing){
					$scope.nextImage();
				}
			},3000);
		}
	}
	$scope.$on('$destroy', function () {
		$timeout.cancel(playTimer);
		$timeout.cancel(fadeTimer);
		angular.element($window).off('keydown ', onKeyPress);
	});

	function playAnim(){
		fadeTimer = $timeout(function(){
			$scope.nextImageOpacity -= 0.06;
			if($scope.nextImageOpacity > 0){
				playAnim();
			}else{
				switchImage();
			}
		},1000/60);
	}
}]);