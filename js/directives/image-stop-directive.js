mainApp.directive('imageStop',['$rootScope',function($rootScope){
	return {
		restrict: 'EA',
		scope:{},
		link:function(scope, element, attrs){
			var offCallMeFn = null;
			function cancelLoad(){
				element[0].setAttribute('src','data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACwAAAAAAQABAAACAkQBADs=');
				removeLoad();
			}
			offCallMeFn = $rootScope.$on('$locationChangeStart', cancelLoad);
			function removeLoad(){
				if(offCallMeFn){
					offCallMeFn();
				}
			}
			element.bind('load', removeLoad);
			scope.$on('$destroy', removeLoad);
		}
	}
}]);