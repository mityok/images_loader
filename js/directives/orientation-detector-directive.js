mainApp.directive('orientationDetector',['$window','$rootScope',function($window, $rootScope){
	return {
		restrict: 'EA',
		scope:{},
		template:'<div>{{orientation}} ({{beta}},{{gamma}},{{alpha}})</div>',
		controller:function($scope){
			$scope.inclination = 0;
			$scope.isUp = false;
			function deviceorientation(e){
				$scope.$applyAsync(function(){
					//portrait (orientation 0) 0 to 90 continue 180
					$scope.beta = Math.round(e.beta);
					//landscape (orientation 90) 0 to -90 jump 90 to 0
					$scope.gamma = Math.round(e.gamma);
					$scope.alpha = Math.round(e.alpha);
					if($scope.orientation == 0 && ($scope.beta > 15 && $scope.beta < 100)){
						$scope.isUp = true;
					}else{
						if($scope.isUp && $rootScope.imgShow){
							$rootScope.imgShow=false;
						}
						$scope.isUp = false;
					}
				});
			}
			function orientationchange(){
				console.log('ch',screen.orientation.angle);
				$scope.$applyAsync(function(){
					$scope.orientation = screen.orientation.angle;
				});
			}
			$scope.init = function(){
				angular.element($window).on('orientationchange',orientationchange);
				orientationchange();
				if (window.DeviceOrientationEvent) {
					angular.element($window).on('deviceorientation',deviceorientation);
				}
			}
			$scope.$on('$destroy', function() {
				angular.element($scope.dropbutton).off('click',toggle);
				angular.element($window).off('mouseup', onMouseDown);
			});
		},
		link: function(scope, element, attrs){
			scope.init();
		}
	}
}]);