"use strict";
mainApp.controller('MenuCtrl', ['$scope', '$rootScope','$window', '$cookies', '$location', '$http', 'dataStorageService',function ($scope, $rootScope,$window, $cookies, $location, $http, dataStorageService) {
	angular.element($window).on('keypress', onKeyPress);
	$rootScope.imgShow = false;
	function onKeyPress(e) {
		console.log(e,String.fromCharCode(e.keyCode));
		if(e.code == 'KeyH'){
			$rootScope.imgShow = !$rootScope.imgShow;
		}
		$scope.$apply();
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