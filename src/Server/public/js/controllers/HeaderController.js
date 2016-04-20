app.controller('HeaderController', ['$scope', '$window', 'loadUser', function($scope, $window, loadUser) {

    $scope.logIned = loadUser.isLogIned();

    if( $scope.logIned ){
        var user = loadUser.getUser();
        user.then(function(result){
            $scope.user = result;
        });
    }

    var loadMenus = function(type){
    	var menus = [
        {
            id: 'myrequest',
    		title: 'My Request',
    		href: '#!/myrequest',
    		class: '',
    		dactivate: '',
    		size: 4
    	},
    	{
            id: 'about',
    		title: 'About',
    		href: '#!/about',
    		class: '',
    		dactivate: '',
    		size: 4
    	},
        {
            id: 'about',
            title: 'About',
            href: '#!/about',
            class: '',
            dactivate: '',
            size: 3
        },
    	{
            id: 'signup',
    		title: 'Sign Up',
    		href: '#modalSignup',
    		class: 'modal-trigger',
    		dactivate: '',
    		size: 4
    	},
    	{
            id: 'login',
    		title: 'Log In',
    		href: '#modalLogin',
    		class: 'modal-trigger',
    		dactivate: '',
    		size: 4
    	},
		{
            id: 'profile',
    		title: 'Profile',
    		href: '',
    		class: 'dropdown-button',
    		dactivate: 'dropdown1',
    		size: 4
    	},
    	{
            id: 'account',
    		title: 'Account',
    		href: '#!/profile',
    		class: '',
    		dactivate: '',
    		size: 3
    	},
    	{
            id: 'logout',
    		title: 'Log out',
    		href: '#modalLogout',
    		class: 'modal-trigger',
    		dactivate: '',
    		size: 3
    	},
    	];

    	var umenus;
    	var mumenus;
    	if($scope.logIned){
    		umenus = [0,1,5];
    		mumenus = [0,6,2,7];
    	}else{
    		umenus = [1,3,4];
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
