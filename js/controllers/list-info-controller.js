"use strict";
mainApp.controller('ListInfoCtrl', ['$scope','$http', '$routeParams', function ($scope, $http, $routeParams) {
	$scope.itemId = $routeParams.itemId;
	function isIncluded(value) {
		//     /^(ra)([0-9]){0,}x([0-9]){0,}\.(jpg)$/g
		// ra4x001.jpg

		var regexp = new RegExp('^('+$scope.itemId.substr(0,2)+')([0-9]){0,}x([0-9]){0,}\.(jpg)$', "g");
		var myArray = value.match(regexp);
		return myArray!=null;
	}
	(function init(){
		$http({method: 'GET', url: 'server/read_folder.php?q='+$scope.itemId, cache: false}).
        then(function(response) {
			if(response.data.message){
				console.log(response.data.message);
				return;
			}
			$scope.collection = response.data.filter(isIncluded);
			console.log($scope.collection);
			
        }, function(response) {
			console.log(response);
		});
	})();
}]);