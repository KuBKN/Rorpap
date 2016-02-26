app.controller('HeaderController', ['$scope', '$http', '$cookies', '$window', function($scope, $http, $cookies, $window) {

	$scope.user = {};
	$scope._id = $cookies.get('_id');

	$scope.load = function() {
        $http.get('/api/user/get/' + $scope._id)
			.success(function(data) {
				$scope.user = data[0];         
			})
			.error(function(data) {
				
			});
    }

	$scope.logIned = $scope._id != undefined;
    if ($scope.logIned) {
        $scope._id = $scope._id.replace(/\"/g, '');
        $scope.load();
    }

    var loadMenus = function(type){
    	var menus = [
    	{
    		title: 'My Request',
    		href: '#!/myrequest',
    		class: '',
    		dactivate: '',
    		size: 4,
    		color: '#ffa337'
    	},
    	{
    		title: 'About',
    		href: '#!/about',
    		class: '',
    		dactivate: '',
    		size: 4,
    		color: '#ffa337'
    	},
    	{
    		title: 'Sign Up',
    		href: '#modalSignup',
    		class: 'modal-trigger',
    		dactivate: '',
    		size: 4,
    		color: '#ffa337'
    	},
    	{
    		title: 'Log In',
    		href: '#modalLogin',
    		class: 'modal-trigger',
    		dactivate: '',
    		size: 4,
    		color: '#ffa337'
    	},
		{
    		title: 'Profile',
    		href: '',
    		class: 'dropdown-button',
    		dactivate: 'dropdown1',
    		size: 4,
    		color: '#ffa337'
    	},
    	{
    		title: 'Account',
    		href: '#!/profile',
    		class: '',
    		dactivate: '',
    		size: 3,
    		color: '#ffa337'
    	},
    	{
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
