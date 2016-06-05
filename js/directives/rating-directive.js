mainApp.directive('rating',['$window', '$routeParams','dataStorageService',function($window,  $routeParams, dataStorageService){
	return {
		restrict: 'EA',
		templateUrl: 'partials/rating.html',
		scope:{
		},
		controller:function($scope){
			

			$scope.$on('$routeChangeSuccess', checkItem);
			function checkItem(){
				$scope.itemId = $routeParams.itemId;
				$scope.serverId = $routeParams.serverId;
				$scope.selectedItem = dataStorageService.getSelectedItem($scope.itemId,$scope.serverId);
			}
			checkItem();
			$scope.rate = function(i){
				$scope.selectedItem.rating = i;
				dataStorageService.setDebounceData(0,true);
			}
		}
	}
}]);