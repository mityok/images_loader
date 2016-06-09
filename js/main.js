'use strict';
var mainApp = angular.module('mainApp', [
  'ngRoute',
  'ngCookies'
]);
mainApp.config(function($routeProvider) {  
    $routeProvider.
      when('/list', {
        templateUrl: 'partials/list.html',
        controller: 'ListCtrl',
		resolve: {
			service: function(dataStorageService){
				return dataStorageService.getStoredData();
				}
			}
      }).
      when('/list/:itemId/:serverId/:updates', {
        templateUrl: 'partials/list-info.html',
        controller: 'ListInfoCtrl',
		resolve: {
			service: function(dataStorageService){
				return dataStorageService.getStoredData();
				}
			}
      }).
	  when('/gallery/:itemId/:serverId', {
        templateUrl: 'partials/gallery.html',
        controller: 'GalleryCtrl',
		resolve: {
			service: function(dataStorageService){
				return dataStorageService.getStoredData();
				}
			}
      }).
	  when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      otherwise({
        redirectTo: '/list'
      });
})
.run(function($window, $rootScope, $location, $cookies) {
	$rootScope.currentUser = $cookies.get('_galleryInfo');
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		$window.stop();
		if ($rootScope.currentUser == null) {
			// no logged user, redirect to /login
			if ( next.templateUrl === "partials/login.html") {

			} else {
				$location.path("/login");
			}
		}
	});
});
