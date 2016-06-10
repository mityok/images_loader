"use strict";
mainApp.controller('MenuCtrl', ['$scope', '$rootScope','$window', '$cookies', '$location', '$http', 'dataStorageService', 'fullscreenService', 'serverStatusService',function ($scope, $rootScope,$window, $cookies, $location, $http, dataStorageService, fullscreenService, serverStatusService) {

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
	$scope.validateAllServers = function(server){
		serverStatusService.validateAllServers();
	}
	$scope.openConsole = function(server){
		$rootScope.consoleShow=!$rootScope.consoleShow;
	}
	$scope.getValidated = function(server){
		var cls = server.selected?'selected ':'';
		if( typeof server.validated == 'undefined'){
			cls+= 'not-checked';
		}else if(server.validated){
			cls+='validated';
		}else{
			cls+='failed';
		}
		return cls;
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
	
}]);