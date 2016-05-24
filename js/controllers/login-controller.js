"use strict";
mainApp.controller('LoginCtrl', ['$scope', '$cookies', '$rootScope', '$location', function ($scope, $cookies, $rootScope, $location) {
	
	//$rootScope.currentUser = $cookies.get('_galleryInfo');
	if($rootScope.currentUser){
		console.log($rootScope.currentUser);
		//$location.path("/list");
	}
	$scope.$watch("pass", function ( newValue, oldValue ) {
		console.log(newValue);
		if(newValue && newValue.length === 15){
			//
			var now = new Date();
			var time = now.getTime();
			time += 24*60*60 * 1000; // one hour
			now.setTime(time);
			//
			$cookies.put('_galleryInfo',newValue,{expires:now});
			$rootScope.currentUser = $cookies.get('_galleryInfo');
			$location.path("/list");
		}
	});
	$scope.clear = function(){
		$cookies.remove('_galleryInfo');
	}
}]);