mainApp.directive('orientationDetector',['$window',function($window){
	return {
		restrict: 'EA',
		scope:{},
		template:'<div>{{orientation}} - ({{beta}},{{gamma}},{{alpha}})</div>',
		controller:function($scope){
			function deviceorientation(e){
				$scope.$applyAsync(function(){
					$scope.beta = Math.round(e.beta);
					$scope.gamma = Math.round(e.gamma);
					$scope.alpha = Math.round(e.alpha);
				});
			}
			function orientationchange(){
				console.log('ch',screen.orientation.angle);
				$scope.$applyAsync(function(){
					$scope.orientation=screen.orientation.angle;
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