mainApp.directive('dropdownMenu',['$window',function($window){
	return {
		restrict: 'EA',
		transclude: true,
		scope:{
			list: "@",
			button: "@"
		},
		controller:function($scope){
			function onMouseDown(e){
				$scope.$applyAsync(function (){
					if(e.target.dataset.forceClose){
						$scope.show = false;
					}else{
						var dropDown = document.getElementsByClassName('button-list')[0];
						var parent = e.target.parentNode;
						while(parent){
							if(parent == document.body){
								$scope.show = false;
								break;
							}else if(parent == dropDown){
								break;
							}
							parent = parent.parentNode;
						}
					}
				});
			}
			$scope.$watch('show',function(newVal,oldVal){
				if(newVal !== oldVal){
					if(newVal){
						angular.element($window).on('mouseup', onMouseDown);
					}else{
						angular.element($window).off('mouseup', onMouseDown);
					}
				}
				$scope.dropmenu.setAttribute('style','display:'+(newVal?'block':'none')+' !important;');
			});
			function toggle(e){
				$scope.show=!$scope.show;
				$scope.$apply();
			}
			$scope.init = function(){
				angular.element($scope.dropbutton).on('click',toggle);
			}
			$scope.$on('$destroy', function() {
				angular.element($scope.dropbutton).off('click',toggle);
				angular.element($window).off('mouseup', onMouseDown);
			});
		},
		link: function(scope, element, attrs){
			scope.dropmenu = element[0].querySelector('.'+scope.list);
			scope.dropbutton = element[0].querySelector('.'+scope.button);
			if(!scope.dropmenu || !scope.dropbutton){
				throw new Error('no float! or button!');
			}
			scope.dropmenu.classList.add('dropdown-menu');
			scope.init();
			
		}
	}
}]);