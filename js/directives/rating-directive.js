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
			$scope.exclude = function(i){
				$scope.selectedItem.excluded = true;
				dataStorageService.setDebounceData(0,true);
				$location.path("/list");
			}
			$scope.getRatingIcon = function(i){
				var arr=['fa-star text-danger', 'fa-star-half-o text-warning', 'fa-star-o text-info', 'fa-star-half-o text-success', ' fa-star text-primary'];
				return arr[i + Math.floor(arr.length / 2)];
			}
		}
	}
}]);