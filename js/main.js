'use strict';
var mainApp = angular.module('mainApp', [
  'ngRoute',
  'ngCookies'
]);
mainApp.config(function($routeProvider) {  
    $routeProvider.
      when('/list', {
        templateUrl: 'partials/list.html',
        controller: 'ListCtrl'
      }).
      when('/list/:itemId', {
        templateUrl: 'partials/list-info.html',
        controller: 'ListInfoCtrl'
      }).
	  when('/login', {
        templateUrl: 'partials/login.html',
        controller: 'LoginCtrl'
      }).
      otherwise({
        redirectTo: '/list'
      });
})
.run(function($rootScope, $location, $cookies) {
	$rootScope.currentUser = $cookies.get('_galleryInfo');
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
