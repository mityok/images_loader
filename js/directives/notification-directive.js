mainApp.directive('notification',['notificationService','TOAST_LENGTH_SHORT','TOAST_LENGTH_LONG','TOAST_TYPE_INFO','TOAST_TYPE_ERROR','TOAST_TYPE_SUCCESS' ,function(notificationService, TOAST_LENGTH_SHORT, TOAST_LENGTH_LONG, TOAST_TYPE_INFO, TOAST_TYPE_ERROR, TOAST_TYPE_SUCCESS){
	return {
		restrict: 'EA',
		templateUrl: 'partials/notification.html',
		scope:{
		},
		link: function(scope, element, attrs){
			notificationService.init(scope);
			element.on('animationend',orientationchange);
			
			function orientationchange(){
				scope.$applyAsync(function(){
					scope.show = false;
				});
			}
			scope.$on('$destroy',function(){
				element.off('animationend',orientationchange);
			});
		}
	}
}]);