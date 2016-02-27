app.controller('HeaderController', ['$scope', '$rootScope', '$http', '$cookies', '$window', function($scope, $rootScope, $http, $cookies, $window) {

	$rootScope.user = {};
	$scope._id = $cookies.get('_id');

	$scope.load = function() {
        $http.get('/api/user/get/' + $scope._id)
			.success(function(data) {
				$rootScope.user = data[0];         
			})
			.error(function(data) {
				
			});
    }

	$rootScope.logIned = $scope._id != undefined;
    if ($rootScope.logIned) {
        $scope._id = $scope._id.replace(/\"/g, '');
        $scope.load();
    }

    var loadMenus = function(type){
    	var menus = [
    	{
            id: 'myrequest',
    		title: 'My Request',
    		href: '#!/myrequest',
    		class: '',
    		dactivate: '',
    		size: 4,
    		color: '#ffa337'
    	},
    	{
            id: 'about',
    		title: 'About',
    		href: '#!/about',
    		class: '',
    		dactivate: '',
    		size: 4,
    		color: '#ffa337'
    	},
    	{
            id: 'signup',
    		title: 'Sign Up',
    		href: '#modalSignup',
    		class: 'modal-trigger',
    		dactivate: '',
    		size: 4,
    		color: '#ffa337'
    	},
    	{
            id: 'login',
    		title: 'Log In',
    		href: '#modalLogin',
    		class: 'modal-trigger',
    		dactivate: '',
    		size: 4,
    		color: '#ffa337'
    	},
		{
            id: 'profile',
    		title: 'Profile',
    		href: '',
    		class: 'dropdown-button',
    		dactivate: 'dropdown1',
    		size: 4,
    		color: '#ffa337'
    	},
    	{
            id: 'account',
    		title: 'Account',
    		href: '#!/profile',
    		class: '',
    		dactivate: '',
    		size: 3,
    		color: '#ffa337'
    	},
    	{
            id: 'logout',
    		title: 'Log out',
    		href: '#modalLogout',
    		class: 'modal-trigger',
    		dactivate: '',
    		size: 3,
    		color: '#ff7171'
    	},
    	];

    	var umenus;
    	var mumenus;
    	if($scope.logIned){
    		umenus = [0,1,4];
    		mumenus = [0,5,1,6];
    	}else{
    		umenus = [1,2,3];
    		mumenus = umenus;
    	}

    	var use = [];
    	var used;
    	if( type == 'desktop' ){
    		used = umenus;
    	}else{
    		used = mumenus;
    	}

    	for(var i = 0; i < used.length; i++){
    		use.push(menus[used[i]]);
    	};

    	return use;
    }

    $scope.menus = loadMenus('desktop');
    $scope.mmenus = loadMenus('mobile');

}]);
