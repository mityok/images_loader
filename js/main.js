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
.constant('TOAST_LENGTH_SHORT',2000)
.constant('TOAST_LENGTH_LONG',4000)
.constant('TOAST_TYPE_INFO','info')
.constant('TOAST_TYPE_ERROR','error')
.constant('TOAST_TYPE_SUCCESS','success')
.run(function($window, $rootScope, $location, $cookies, visibilityService) {
	$rootScope.visibilityService = visibilityService;
	$rootScope.currentUser = $cookies.get('_galleryInfo');
	$rootScope.$watch('visibilityService.getDocumentVisiblity()', function(newVal,oldVal) {
		console.log(newVal,oldVal);
		if(newVal===false && $rootScope.imgShow){
			$rootScope.imgShow = false;
		}
	});
	$rootScope.$on( "$routeChangeStart", function(event, next, current) {
		if ($rootScope.currentUser == null) {
			// no logged user, redirect to /login
			if ( next.templateUrl === "partials/login.html") {

			} else {
				$location.path("/login");
			}
		}
	});
});
