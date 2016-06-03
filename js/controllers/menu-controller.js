"use strict";
mainApp.controller('MenuCtrl', ['$scope', '$rootScope','$window', '$cookies', '$location', '$http', 'dataStorageService', 'fullscreenService', 'serverStatusService',function ($scope, $rootScope,$window, $cookies, $location, $http, dataStorageService, fullscreenService,serverStatusService) {
	$scope.menu={show:false};
	angular.element($window).on('keypress', onKeyPress);
	$rootScope.imgShow = false;
	$scope.dataService = dataStorageService;
	$scope.$watch('dataService.getTime()', function(newVal) {
		if(newVal){
			$scope.latestUpdate = newVal;
		}
	});
	function onKeyPress(e) {
		if(e.code == 'KeyV' && $location.path() != "/login"){
			$rootScope.imgShow = !$rootScope.imgShow;
		}
		$scope.$apply();
	}
	$scope.serverList = serverStatusService.getServerList();
	$scope.getValidated = function(server){
		if( typeof server.validated == 'undefined'){
			return 'not-checked';
		}else if(server.validated){
			return 'validated';
		}else{
			return 'failed';
		}
	}
	$scope.setServer = function(server){
		serverStatusService.setServer(server);
	}
	$scope.isFullScreen = function(){
		return fullscreenService.fullscreenElement() !== null;
	}
	$scope.fullScreen = function(){
		fullscreenService.toggleFullscreen();
	}
	$scope.clearSession = function(){
		$rootScope.currentUser = null;
		$cookies.remove('_galleryInfo');
		$http({method: 'GET', url: 'server/test_proxy.php?c=1', cache: false});
		$location.path("/login");
	}
	$scope.loadFromInternetGalleries = function(){
		dataStorageService.loadFromNet();
	}
	$scope.dropPreloadedGalleries = function(){
		dataStorageService.setDebounceData(0,true);
	}
	$scope.toggleRootShow = function(){
		$rootScope.imgShow = !$rootScope.imgShow;
	}
	function onMouseDown(e){
		$scope.$applyAsync(function (){
			if(e.target.dataset.forceClose){
				$scope.menu.show = false;
			}else{
				var dropDown = document.getElementsByClassName('button-list')[0];
				var parent = e.target.parentNode;
				while(parent){
					if(parent == document.body){
						$scope.menu.show = false;
						break;
					}else if(parent == dropDown){
						break;
					}
					parent = parent.parentNode;
				}
			}
		});
	}

	$scope.$watch('menu.show',function(newVal,oldVal){
		if(newVal !== oldVal){
			if(newVal){
				angular.element($window).on('mouseup', onMouseDown);
			}else{
				angular.element($window).off('mouseup', onMouseDown);
			}
		}
	});
}]);