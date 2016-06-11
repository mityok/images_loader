mainApp.directive('materialButton',[function(){
	return {
		restrict: 'EA',
		scope:{
		},
		link: function(scope, element, attrs){
			element[0].classList.add('md-button');
			var click = function(e) {
				for (var i = 0; i <= 100; i += 10) {
					e.target.classList.remove('left-' + i);
					e.target.classList.remove('top-' + i);
				}
				e.target.classList.remove('action');
				//
				var left = Math.round(10 * e.offsetX / e.target.offsetWidth) * 10;
				var top = Math.round(10 * e.offsetY / e.target.offsetHeight) * 10;
				//
				e.target.classList.add('left-' + left);
				e.target.classList.add('top-' + top);
				e.target.classList.add('action');
			}
			element.on('click', click);
			scope.$on('$destroy', function () {
				element.off('click', click);
			});
		}
	}
}]);
