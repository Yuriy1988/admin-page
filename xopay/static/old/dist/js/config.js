APP
// save user locale on server
.config(function($provide){
   $provide.decorator('$translateLocalStorage',function($delegate,$http){
      var originPut = $delegate.put;
      $delegate.put = function(key,value) {
         originPut(key,value);
         if ( value )
            $http.put(URL.LANG.ONE,{lang: value});
      };
      return $delegate;
   });
})
// load user locale from server
.run(function($STORAGE_KEY,$translateLocalStorage,$translate,$http){
   var lang = $translateLocalStorage.get($STORAGE_KEY);
   if ( 'undefined' === lang ) {
      function setDefault() { $translate.use($translate.fallbackLanguage()); }
      $http.get(URL.LANG.ONE).then(
         function(_){
            $translate.use(_.data.lang);
         }
         ,function(_){ setDefault(); }
      );
   }
})
// angular translate configuration
.config(function($translateProvider){
   $translateProvider
      //.translations('en',$$EN)
      .fallbackLanguage('ru')
      .useUrlLoader    (URL.LANG.TRANSLATE)
      .forceAsyncReload(true)
      //.useSanitizeValueStrategy('sanitizeParameters')
      .useLocalStorage ();
})
// routing
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
   $urlRouterProvider
      .when('/merchants', '/merchants/add')
      //.when('/' , '/main')
      .otherwise('/');

   $stateProvider
      .state('signup',{
         url         : '/login',
         templateUrl : HOME + 'views/login.html',
         controller  : 'loginCtrl'
      })
      /* pay systems */
      .state('pay', {
         url         : '/pay',
         templateUrl : HOME + 'views/payList.html',
         controller  : 'paySystemListCtrl'
      })
      .state('pay.edit', {
         url         : '/edit/{systemId}',
         templateUrl : HOME + 'views/payEdit.html',
         controller  : 'paySystemEditCtrl'
      })
      /* merchants */
      .state('merchant', {
         url         : '/merchant/{merchantId}',
         templateUrl : HOME + 'views/merchantView.html',
         controller  : 'merchantListCtrl'
      })
      .state('merchantEdit', {
         url         : '/merchant/{merchantId}/edit',
         templateUrl : HOME + 'views/merchantEdit.html',
         controller  : 'merchantEditCtrl'
      })
      .state('merchantAdd', {
         url         : '/merchants/add',
         templateUrl : HOME + 'views/merchantEdit.html',
         controller  : 'merchantEditCtrl'
      })
      /* merchant sites */
      .state('merchant.sites', {
         url         : '/sites',
         templateUrl : HOME + 'views/merchantSites.html',
         controller  : 'merchantSiteListCtrl'
      })
      .state('merchant.addSite', {
         url         : '/addSite',
         templateUrl : HOME + 'views/merchantSiteEdit.html',
         controller  : 'merchantSiteAddCtrl'
      })
      .state('merchant.editSite', {
         url         : '/sites/{siteId}/edit',
         templateUrl : HOME + 'views/merchantSiteEdit.html',
         controller  : 'merchantSiteEditCtrl'
      })
      .state('merchant.paySite', {
         url         : '/sites/{siteId}/pays',
         templateUrl : HOME + 'views/merchantSitePays.html',
         controller  : 'merchantSitePayCtrl'
      })

      /*
      .state('merchant.statSite', {
         url         : '/sites/{siteId}/stat',
         templateUrl : HOME + 'views/merchantSiteStat.html',
         controller  : CONTROLLERS.merchantSitesStat
      })
      */

      /* merchant users*/
      .state('merchant.users', {
         url         : '/users',
         templateUrl : HOME + 'views/merchantUsers.html',
         controller  : 'merchantUserListCtrl'
      })
      .state('merchant.usersAdd', {
         url         : '/add',
         templateUrl : HOME + 'views/merchantUserEdit.html',
         controller  : 'merchantUserAddCtrl'
      })
      .state('merchant.usersEdit', {
         url         : '/{userId}/edit',
         templateUrl : HOME + 'views/merchantUserEdit.html',
         controller  : 'merchantUserEditCtrl'
      })
      /* currency course */
      .state('moneyCourses', {
         url         : '/money',
         templateUrl : HOME + 'views/money.html'
      })

      /* administrators */
      .state('adminAdd',{
         url         : '/admins/add',
         templateUrl : HOME + 'views/merchantUserEdit.html',
         controller  : 'adminAddCtrl'
      })

      /* sales */
      .state('main',{
         url         : '/',
         templateUrl : HOME + 'views/main.html'
      })

}])
.run(['$rootScope', '$location', '$cookieStore', '$http', '$state',
   function ($rootScope, $location, $cookieStore, $http, $state) {
      // keep user logged in after page refresh
      $rootScope.globals = $cookieStore.get('globals') || {};
      if ($rootScope.globals.currentUser) {
         $http.defaults.headers.common['Authorization'] = 'Basic ' + $rootScope.globals.currentUser.authdata; // jshint ignore:line
      }

      $rootScope.$on('$locationChangeStart', function (event, next, current) {
         // redirect to login page if not logged in
         if ($location.path() !== '/login' && !$rootScope.globals.currentUser) {
            $location.path('/login');
         }
      });
   }])
;