'use strict';
mainApp.filter('shortenUrl', function() {
    return function(x) {
		var res = x.split('/');
        if(x.startsWith('http')){
			return res[2];
		}
        return res[0];
    };
});
