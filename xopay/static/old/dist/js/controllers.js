APP.controller('Main',              ['$rootScope', '$scope', '$state', '$http', '$translate', function($rootScope, $scope, $state, $http, $translate) {
   $scope.$state       = $state;
   $scope.icons        = {
      'Main': ['fa-500px', 'fa-amazon', 'fa-balance-scale', 'fa-battery-0', 'fa-battery-1', 'fa-battery-2', 'fa-battery-3', 'fa-battery-4', 'fa-battery-empty', 'fa-battery-full', 'fa-battery-half', 'fa-battery-quarter', 'fa-battery-three-quarters', 'fa-black-tie', 'fa-calendar-check-o', 'fa-calendar-minus-o', 'fa-calendar-plus-o', 'fa-calendar-times-o', 'fa-cc-diners-club', 'fa-cc-jcb', 'fa-chrome', 'fa-clone', 'fa-commenting', 'fa-commenting-o', 'fa-contao', 'fa-creative-commons', 'fa-expeditedssl', 'fa-firefox', 'fa-fonticons', 'fa-genderless', 'fa-get-pocket', 'fa-gg', 'fa-gg-circle', 'fa-hand-grab-o', 'fa-hand-lizard-o', 'fa-hand-paper-o', 'fa-hand-peace-o', 'fa-hand-pointer-o', 'fa-hand-rock-o', 'fa-hand-scissors-o', 'fa-hand-spock-o', 'fa-hand-stop-o', 'fa-hourglass', 'fa-hourglass-1', 'fa-hourglass-2', 'fa-hourglass-3', 'fa-hourglass-end', 'fa-hourglass-half', 'fa-hourglass-o', 'fa-hourglass-start', 'fa-houzz', 'fa-i-cursor', 'fa-industry', 'fa-internet-explorer', 'fa-map', 'fa-map-o', 'fa-map-pin', 'fa-map-signs', 'fa-mouse-pointer', 'fa-object-group', 'fa-object-ungroup', 'fa-odnoklassniki', 'fa-odnoklassniki-square', 'fa-opencart', 'fa-opera', 'fa-optin-monster', 'fa-registered', 'fa-safari', 'fa-sticky-note', 'fa-sticky-note-o', 'fa-television', 'fa-trademark', 'fa-tripadvisor', 'fa-tv', 'fa-vimeo', 'fa-wikipedia-w', 'fa-y-combinator', 'fa-yc'],
      'Web Application Icons': ['fa-adjust', 'fa-anchor', 'fa-archive', 'fa-area-chart', 'fa-arrows', 'fa-arrows-h', 'fa-arrows-v', 'fa-asterisk', 'fa-at', 'fa-automobile', 'fa-balance-scale', 'fa-ban', 'fa-bank', 'fa-bar-chart', 'fa-bar-chart-o', 'fa-barcode', 'fa-bars', 'fa-battery-0', 'fa-battery-1', 'fa-battery-2', 'fa-battery-3', 'fa-battery-4', 'fa-battery-empty', 'fa-battery-full', 'fa-battery-half', 'fa-battery-quarter', 'fa-battery-three-quarters', 'fa-bed', 'fa-beer', 'fa-bell', 'fa-bell-o', 'fa-bell-slash', 'fa-bell-slash-o', 'fa-bicycle', 'fa-binoculars', 'fa-birthday-cake', 'fa-bolt', 'fa-bomb', 'fa-book', 'fa-bookmark', 'fa-bookmark-o', 'fa-briefcase', 'fa-bug', 'fa-building', 'fa-building-o', 'fa-bullhorn', 'fa-bullseye', 'fa-bus', 'fa-cab', 'fa-calculator', 'fa-calendar', 'fa-calendar-check-o', 'fa-calendar-minus-o', 'fa-calendar-o', 'fa-calendar-plus-o', 'fa-calendar-times-o', 'fa-camera', 'fa-camera-retro', 'fa-car', 'fa-caret-square-o-down', 'fa-caret-square-o-left', 'fa-caret-square-o-right', 'fa-caret-square-o-up', 'fa-cart-arrow-down', 'fa-cart-plus', 'fa-cc', 'fa-certificate', 'fa-check', 'fa-check-circle', 'fa-check-circle-o', 'fa-check-square', 'fa-check-square-o', 'fa-child', 'fa-circle', 'fa-circle-o', 'fa-circle-o-notch', 'fa-circle-thin', 'fa-clock-o', 'fa-clone', 'fa-close', 'fa-cloud', 'fa-cloud-download', 'fa-cloud-upload', 'fa-code', 'fa-code-fork', 'fa-coffee', 'fa-cog', 'fa-cogs', 'fa-comment', 'fa-comment-o', 'fa-commenting', 'fa-commenting-o', 'fa-comments', 'fa-comments-o', 'fa-compass', 'fa-copyright', 'fa-creative-commons', 'fa-credit-card', 'fa-crop', 'fa-crosshairs', 'fa-cube', 'fa-cubes', 'fa-cutlery', 'fa-dashboard', 'fa-database', 'fa-desktop', 'fa-diamond', 'fa-dot-circle-o', 'fa-download', 'fa-edit', 'fa-ellipsis-h', 'fa-ellipsis-v', 'fa-envelope', 'fa-envelope-o', 'fa-envelope-square', 'fa-eraser', 'fa-exchange', 'fa-exclamation', 'fa-exclamation-circle', 'fa-exclamation-triangle', 'fa-external-link', 'fa-external-link-square', 'fa-eye', 'fa-eye-slash', 'fa-eyedropper', 'fa-fax', 'fa-feed', 'fa-female', 'fa-fighter-jet', 'fa-file-archive-o', 'fa-file-audio-o', 'fa-file-code-o', 'fa-file-excel-o', 'fa-file-image-o', 'fa-file-movie-o', 'fa-file-pdf-o', 'fa-file-photo-o', 'fa-file-picture-o', 'fa-file-powerpoint-o', 'fa-file-sound-o', 'fa-file-video-o', 'fa-file-word-o', 'fa-file-zip-o', 'fa-film', 'fa-filter', 'fa-fire', 'fa-fire-extinguisher', 'fa-flag', 'fa-flag-checkered', 'fa-flag-o', 'fa-flash', 'fa-flask', 'fa-folder', 'fa-folder-o', 'fa-folder-open', 'fa-folder-open-o', 'fa-frown-o', 'fa-futbol-o', 'fa-gamepad', 'fa-gavel', 'fa-gear', 'fa-gears', 'fa-gift', 'fa-glass', 'fa-globe', 'fa-graduation-cap', 'fa-group', 'fa-hand-grab-o', 'fa-hand-lizard-o', 'fa-hand-paper-o', 'fa-hand-peace-o', 'fa-hand-pointer-o', 'fa-hand-rock-o', 'fa-hand-scissors-o', 'fa-hand-spock-o', 'fa-hand-stop-o', 'fa-hdd-o', 'fa-headphones', 'fa-heart', 'fa-heart-o', 'fa-heartbeat', 'fa-history', 'fa-home', 'fa-hotel', 'fa-hourglass', 'fa-hourglass-1', 'fa-hourglass-2', 'fa-hourglass-3', 'fa-hourglass-end', 'fa-hourglass-half', 'fa-hourglass-o', 'fa-hourglass-start', 'fa-i-cursor', 'fa-image', 'fa-inbox', 'fa-industry', 'fa-info', 'fa-info-circle', 'fa-institution', 'fa-key', 'fa-keyboard-o', 'fa-language', 'fa-laptop', 'fa-leaf', 'fa-legal', 'fa-lemon-o', 'fa-level-down', 'fa-level-up', 'fa-life-bouy', 'fa-life-buoy', 'fa-life-ring', 'fa-life-saver', 'fa-lightbulb-o', 'fa-line-chart', 'fa-location-arrow', 'fa-lock', 'fa-magic', 'fa-magnet', 'fa-mail-forward', 'fa-mail-reply', 'fa-mail-reply-all', 'fa-male', 'fa-map', 'fa-map-marker', 'fa-map-o', 'fa-map-pin', 'fa-map-signs', 'fa-meh-o', 'fa-microphone', 'fa-microphone-slash', 'fa-minus', 'fa-minus-circle', 'fa-minus-square', 'fa-minus-square-o', 'fa-mobile', 'fa-mobile-phone', 'fa-money', 'fa-moon-o', 'fa-mortar-board', 'fa-motorcycle', 'fa-mouse-pointer', 'fa-music', 'fa-navicon', 'fa-newspaper-o', 'fa-object-group', 'fa-object-ungroup', 'fa-paint-brush', 'fa-paper-plane', 'fa-paper-plane-o', 'fa-paw', 'fa-pencil', 'fa-pencil-square', 'fa-pencil-square-o', 'fa-phone', 'fa-phone-square', 'fa-photo', 'fa-picture-o', 'fa-pie-chart', 'fa-plane', 'fa-plug', 'fa-plus', 'fa-plus-circle', 'fa-plus-square', 'fa-plus-square-o', 'fa-power-off', 'fa-print', 'fa-puzzle-piece', 'fa-qrcode', 'fa-question', 'fa-question-circle', 'fa-quote-left', 'fa-quote-right', 'fa-random', 'fa-recycle', 'fa-refresh', 'fa-registered', 'fa-remove', 'fa-reorder', 'fa-reply', 'fa-reply-all', 'fa-retweet', 'fa-road', 'fa-rocket', 'fa-rss', 'fa-rss-square', 'fa-search', 'fa-search-minus', 'fa-search-plus', 'fa-send', 'fa-send-o', 'fa-server', 'fa-share', 'fa-share-alt', 'fa-share-alt-square', 'fa-share-square', 'fa-share-square-o', 'fa-shield', 'fa-ship', 'fa-shopping-cart', 'fa-sign-in', 'fa-sign-out', 'fa-signal', 'fa-sitemap', 'fa-sliders', 'fa-smile-o', 'fa-soccer-ball-o', 'fa-sort', 'fa-sort-alpha-asc', 'fa-sort-alpha-desc', 'fa-sort-amount-asc', 'fa-sort-amount-desc', 'fa-sort-asc', 'fa-sort-desc', 'fa-sort-down', 'fa-sort-numeric-asc', 'fa-sort-numeric-desc', 'fa-sort-up', 'fa-space-shuttle', 'fa-spinner', 'fa-spoon', 'fa-square', 'fa-square-o', 'fa-star', 'fa-star-half', 'fa-star-half-empty', 'fa-star-half-full', 'fa-star-half-o', 'fa-star-o', 'fa-sticky-note', 'fa-sticky-note-o', 'fa-street-view', 'fa-suitcase', 'fa-sun-o', 'fa-support', 'fa-tablet', 'fa-tachometer', 'fa-tag', 'fa-tags', 'fa-tasks', 'fa-taxi', 'fa-television', 'fa-terminal', 'fa-thumb-tack', 'fa-thumbs-down', 'fa-thumbs-o-down', 'fa-thumbs-o-up', 'fa-thumbs-up', 'fa-ticket', 'fa-times', 'fa-times-circle', 'fa-times-circle-o', 'fa-tint', 'fa-toggle-down', 'fa-toggle-left', 'fa-toggle-off', 'fa-toggle-on', 'fa-toggle-right', 'fa-toggle-up', 'fa-trademark', 'fa-trash', 'fa-trash-o', 'fa-tree', 'fa-trophy', 'fa-truck', 'fa-tty', 'fa-tv', 'fa-umbrella', 'fa-university', 'fa-unlock', 'fa-unlock-alt', 'fa-unsorted', 'fa-upload', 'fa-user', 'fa-user-plus', 'fa-user-secret', 'fa-user-times', 'fa-users', 'fa-video-camera', 'fa-volume-down', 'fa-volume-off', 'fa-volume-up', 'fa-warning', 'fa-wheelchair', 'fa-wifi', 'fa-wrench'],
      'Hand Icons': ['fa-hand-grab-o', 'fa-hand-lizard-o', 'fa-hand-o-down', 'fa-hand-o-left', 'fa-hand-o-right', 'fa-hand-o-up', 'fa-hand-paper-o', 'fa-hand-peace-o', 'fa-hand-pointer-o', 'fa-hand-rock-o', 'fa-hand-scissors-o', 'fa-hand-spock-o', 'fa-hand-stop-o', 'fa-thumbs-down', 'fa-thumbs-o-down', 'fa-thumbs-o-up', 'fa-thumbs-up'],
      'Transportation Icons': ['fa-ambulance', 'fa-automobile', 'fa-bicycle', 'fa-bus', 'fa-cab', 'fa-car', 'fa-fighter-jet', 'fa-motorcycle', 'fa-plane', 'fa-rocket', 'fa-ship', 'fa-space-shuttle', 'fa-subway', 'fa-taxi', 'fa-train', 'fa-truck', 'fa-wheelchair'],
      'Gender Icons': ['fa-genderless', 'fa-intersex', 'fa-mars', 'fa-mars-double', 'fa-mars-stroke', 'fa-mars-stroke-h', 'fa-mars-stroke-v', 'fa-mercury', 'fa-neuter', 'fa-transgender', 'fa-transgender-alt', 'fa-venus', 'fa-venus-double', 'fa-venus-mars'],
      'File Type cons': ['fa-file', 'fa-file-archive-o', 'fa-file-audio-o', 'fa-file-code-o', 'fa-file-excel-o', 'fa-file-image-o', 'fa-file-movie-o', 'fa-file-o', 'fa-file-pdf-o', 'fa-file-photo-o', 'fa-file-picture-o', 'fa-file-powerpoint-o', 'fa-file-sound-o', 'fa-file-text', 'fa-file-text-o', 'fa-file-video-o', 'fa-file-word-o', 'fa-file-zip-o'],
      'Spinner Icons': ['fa-circle-o-notch', 'fa-cog', 'fa-gear', 'fa-refresh', 'fa-spinner'],
      'Form Control Icons': ['fa-check-square', 'fa-check-square-o', 'fa-circle', 'fa-circle-o', 'fa-dot-circle-o', 'fa-minus-square', 'fa-minus-square-o', 'fa-plus-square', 'fa-plus-square-o', 'fa-square', 'fa-square-o'],
      'Payment Icons': ['fa-cc-amex', 'fa-cc-diners-club', 'fa-cc-discover', 'fa-cc-jcb', 'fa-cc-mastercard', 'fa-cc-paypal', 'fa-cc-stripe', 'fa-cc-visa', 'fa-credit-card', 'fa-google-wallet', 'fa-paypal'],
      'Chart Icons': ['fa-area-chart', 'fa-bar-chart', 'fa-bar-chart-o', 'fa-line-chart', 'fa-pie-chart'],
      'Currency Icons': ['fa-bitcoin', 'fa-btc', 'fa-cny', 'fa-dollar', 'fa-eur', 'fa-euro', 'fa-gbp', 'fa-gg', 'fa-gg-circle', 'fa-ils', 'fa-inr', 'fa-jpy', 'fa-krw', 'fa-money', 'fa-rmb', 'fa-rouble', 'fa-rub', 'fa-ruble', 'fa-rupee', 'fa-shekel', 'fa-sheqel', 'fa-try', 'fa-turkish-lira', 'fa-usd', 'fa-won', 'fa-yen'],
      'Text Editor Icons': ['fa-align-center', 'fa-align-justify', 'fa-align-left', 'fa-align-right', 'fa-bold', 'fa-chain', 'fa-chain-broken', 'fa-clipboard', 'fa-columns', 'fa-copy', 'fa-cut', 'fa-dedent', 'fa-eraser', 'fa-file', 'fa-file-o', 'fa-file-text', 'fa-file-text-o', 'fa-files-o', 'fa-floppy-o', 'fa-font', 'fa-header', 'fa-indent', 'fa-italic', 'fa-link', 'fa-list', 'fa-list-alt', 'fa-list-ol', 'fa-list-ul', 'fa-outdent', 'fa-paperclip', 'fa-paragraph', 'fa-paste', 'fa-repeat', 'fa-rotate-left', 'fa-rotate-right', 'fa-save', 'fa-scissors', 'fa-strikethrough', 'fa-subscript', 'fa-superscript', 'fa-table', 'fa-text-height', 'fa-text-width', 'fa-th', 'fa-th-large', 'fa-th-list', 'fa-underline', 'fa-undo', 'fa-unlink'],
      'Directional Icons': ['fa-angle-double-down', 'fa-angle-double-left', 'fa-angle-double-right', 'fa-angle-double-up', 'fa-angle-down', 'fa-angle-left', 'fa-angle-right', 'fa-angle-up', 'fa-arrow-circle-down', 'fa-arrow-circle-left', 'fa-arrow-circle-o-down', 'fa-arrow-circle-o-left', 'fa-arrow-circle-o-right', 'fa-arrow-circle-o-up', 'fa-arrow-circle-right', 'fa-arrow-circle-up', 'fa-arrow-down', 'fa-arrow-left', 'fa-arrow-right', 'fa-arrow-up', 'fa-arrows', 'fa-arrows-alt', 'fa-arrows-h', 'fa-arrows-v', 'fa-caret-down', 'fa-caret-left', 'fa-caret-right', 'fa-caret-square-o-down', 'fa-caret-square-o-left', 'fa-caret-square-o-right', 'fa-caret-square-o-up', 'fa-caret-up', 'fa-chevron-circle-down', 'fa-chevron-circle-left', 'fa-chevron-circle-right', 'fa-chevron-circle-up', 'fa-chevron-down', 'fa-chevron-left', 'fa-chevron-right', 'fa-chevron-up', 'fa-exchange', 'fa-hand-o-down', 'fa-hand-o-left', 'fa-hand-o-right', 'fa-hand-o-up', 'fa-long-arrow-down', 'fa-long-arrow-left', 'fa-long-arrow-right', 'fa-long-arrow-up', 'fa-toggle-down', 'fa-toggle-left', 'fa-toggle-right', 'fa-toggle-up'],
      'Video Player Icons': ['fa-arrows-alt', 'fa-backward', 'fa-compress', 'fa-eject', 'fa-expand', 'fa-fast-backward', 'fa-fast-forward', 'fa-forward', 'fa-pause', 'fa-play', 'fa-play-circle', 'fa-play-circle-o', 'fa-random', 'fa-step-backward', 'fa-step-forward', 'fa-stop', 'fa-youtube-play'],
      'Brand Icons': ['fa-500px', 'fa-adn', 'fa-amazon', 'fa-android', 'fa-angellist', 'fa-apple', 'fa-behance', 'fa-behance-square', 'fa-bitbucket', 'fa-bitbucket-square', 'fa-bitcoin', 'fa-black-tie', 'fa-btc', 'fa-buysellads', 'fa-cc-amex', 'fa-cc-diners-club', 'fa-cc-discover', 'fa-cc-jcb', 'fa-cc-mastercard', 'fa-cc-paypal', 'fa-cc-stripe', 'fa-cc-visa', 'fa-chrome', 'fa-codepen', 'fa-connectdevelop', 'fa-contao', 'fa-css3', 'fa-dashcube', 'fa-delicious', 'fa-deviantart', 'fa-digg', 'fa-dribbble', 'fa-dropbox', 'fa-drupal', 'fa-empire', 'fa-expeditedssl', 'fa-facebook', 'fa-facebook-f', 'fa-facebook-official', 'fa-facebook-square', 'fa-firefox', 'fa-flickr', 'fa-fonticons', 'fa-forumbee', 'fa-foursquare', 'fa-ge', 'fa-get-pocket', 'fa-gg', 'fa-gg-circle', 'fa-git', 'fa-git-square', 'fa-github', 'fa-github-alt', 'fa-github-square', 'fa-gittip', 'fa-google', 'fa-google-plus', 'fa-google-plus-square', 'fa-google-wallet', 'fa-gratipay', 'fa-hacker-news', 'fa-houzz', 'fa-html5', 'fa-instagram', 'fa-internet-explorer', 'fa-ioxhost', 'fa-joomla', 'fa-jsfiddle', 'fa-lastfm', 'fa-lastfm-square', 'fa-leanpub', 'fa-linkedin', 'fa-linkedin-square', 'fa-linux', 'fa-maxcdn', 'fa-meanpath', 'fa-medium', 'fa-odnoklassniki', 'fa-odnoklassniki-square', 'fa-opencart', 'fa-openid', 'fa-opera', 'fa-optin-monster', 'fa-pagelines', 'fa-paypal', 'fa-pied-piper', 'fa-pied-piper-alt', 'fa-pinterest', 'fa-pinterest-p', 'fa-pinterest-square', 'fa-qq', 'fa-ra', 'fa-rebel', 'fa-reddit', 'fa-reddit-square', 'fa-renren', 'fa-safari', 'fa-sellsy', 'fa-share-alt', 'fa-share-alt-square', 'fa-shirtsinbulk', 'fa-simplybuilt', 'fa-skyatlas', 'fa-skype', 'fa-slack', 'fa-slideshare', 'fa-soundcloud', 'fa-spotify', 'fa-stack-exchange', 'fa-stack-overflow', 'fa-steam', 'fa-steam-square', 'fa-stumbleupon', 'fa-stumbleupon-circle', 'fa-tencent-weibo', 'fa-trello', 'fa-tripadvisor', 'fa-tumblr', 'fa-tumblr-square', 'fa-twitch', 'fa-twitter', 'fa-twitter-square', 'fa-viacoin', 'fa-vimeo', 'fa-vimeo-square', 'fa-vine', 'fa-vk', 'fa-wechat', 'fa-weibo', 'fa-weixin', 'fa-whatsapp', 'fa-wikipedia-w', 'fa-windows', 'fa-wordpress', 'fa-xing', 'fa-xing-square', 'fa-y-combinator', 'fa-y-combinator-square', 'fa-yahoo', 'fa-yc', 'fa-yc-square', 'fa-yelp', 'fa-youtube', 'fa-youtube-play', 'fa-youtube-square'],
      'Medical Icons': ['fa-ambulance', 'fa-h-square', 'fa-heart', 'fa-heart-o', 'fa-heartbeat', 'fa-hospital-o', 'fa-medkit', 'fa-plus-square', 'fa-stethoscope', 'fa-user-md', 'fa-wheelchair']
   };

   $scope.CRUD = CRUD;
   $scope.CRUD.test = function(num, num1) {
      return num & num1;
   };
   $scope.CRUD.set = function(num, num1) {
      return num ^ num1;
   };

   $scope.currencies = [];

   $http.get(
      URL.CURRENCIES
   ).then(function(r) {
         r = r.data.response;

         angular.forEach(r, function(c) {
            $scope.currencies.push(c);

            if ( ! $scope.$$phase) {
               $scope.$apply();
            }
         })
      });

   var langs  = [
       {code:'ru',name:'RU'}
      ,{code:'en',name:'EN'}
   ];

   $http.get(URL.LANG.BASE).then(function(r){
      langs = [];
      angular.forEach(r.data,function(v,k){
         langs.push({code:k,name:v});}
      );
   });

   $scope.langs   = function()      { return langs;                 }
   $scope.getLang = function()      { return $translate.use();      }
   $scope.setLang = function(locale){ return $translate.use(locale);}
}])
/* sidebar controller */
.controller('Sidebar',              ['$scope', '$rootScope', '$state', '$http', function($scope, $rootScope, $state, $http) {
   $rootScope.SidebarUpdate = function() {
      $http.get(URL.MERCHANT.BASE).then(function(r) {
         $scope.merchants  = {};

         angular.forEach(r.data.response, function(merchant) {
            $scope.merchants[merchant.id] = merchant;
         });

         if ( ! $scope.$$phase) {
            $scope.$apply();
         }
      });
   };

   $rootScope.SidebarUpdate();
}])
/* all supported pay systems */
.controller('paySystemListCtrl',    ['$scope', '$http', function($scope, $http){
      $scope.systems = [];

      $http.get(URL.PAY_SYSTEM).then(function(r){
         $scope.systems = r.data.response;
      });
}])
/* edit pay system configuration */
.controller('paySystemEditCtrl',    ['$scope', '$stateParams', '$state', '$http', 'notifier',function($scope, $stateParams, $state, $http, notifier) {
      $scope.systemId   = $stateParams.systemId
      $scope.actionType = 'edit';
      $scope.errors     = {};
      $scope.save       = function() {
         var target     = {
             enabled : false
            ,name    : ""
            ,type    : ""
            ,login   : ""
            ,password: ""
         };
         angular.extend( target, $scope.$parent.systems[$stateParams.systemId-1] );

         $http.put(URL.PAY_SYSTEM, target).then(function(){
            $scope.errors = {};
            notifier.info("Платежная система отредактирована успешно.");
            $state.go('pay')
         },function(r) {
            if (r.data.response.errors) {
               $scope.errors = r.data.response.errors;
            } else {
               notifier.error("Ошибка редактирования платежной системы!");
               $state.go('pay', {}, {reload: true})
            }
         })
      }
   }])
.controller('merchantListCtrl',     ['$scope', '$stateParams', '$state', '$http', '$log','$rootScope', function($scope, $stateParams, $state, $http, $log, $rootScope) {
      $http.get(
         URL.MERCHANT.ONE($stateParams.merchantId)
      ).then(function(r) {
            r = r.data.response;
            $scope.merchant   = r;
         });

      $scope.merchantId = $stateParams.merchantId;

      $scope.remove   = function() {
         $http.delete(
            URL.MERCHANT.ONE($stateParams.merchantId)
         ).then(function(r) {
               if(!r.data.response)
                  $log.error(
                     "Merchant with id "+$stateParams.merchantId+" delete error!"
                  );
               else {
                  if(!r.data.response)
                     $log.error(
                        "Merchant with id "+$stateParams.merchantId+" delete error!"
                     );
                  else {
                     $rootScope.SidebarUpdate();
                     $state.go('merchantAdd');
                  }
               }
            });
      };
   }])
/* create/edit merchant */
.controller('merchantEditCtrl',     ['$rootScope', '$scope', '$state', '$stateParams', '$http', 'notifier', function($rootScope, $scope, $state, $stateParams, $http, notifier) {
      $scope.merchant = {
         id      : null,
         name    : null,
         merchantInfo: {
            id          : null,
            directorName: null,
            email       : null,
            phone       : null,
            address     : null
         },
         merchantAccount : {
            id              : null,
            checkingAccount : null,
            mfo             : null,
            okpo            : null,
            bankName        : null,
            currency        : null
         }
      };

      $scope.errors = {};

      if(!$stateParams.merchantId){
         $scope.actionType = 'create';
      }else{
         $scope.actionType = 'edit';
         $scope.merchantId = $stateParams.merchantId;

         $http.get(URL.MERCHANT.ONE($stateParams.merchantId)).then(function(r) {
            r = r.data.response;

            angular.extend($scope.merchant, r);

            if ( ! $scope.$$phase) {
               $scope.$apply();
            }
         });
      }

      $scope.save = function() {
         $http.put(URL.MERCHANT.BASE, $scope.merchant).then(function(r) {
            $scope.errors = {};
            r = r.data.response;

            angular.extend($scope.merchant, r);
            if ( ! $scope.$$phase) {
               $scope.$apply();
            }

            $rootScope.SidebarUpdate();

            notifier.info(
               $scope.actionType == 'edit'
                   ? "Мерчант отредактирован успешно."
                   : "Мерчант добавлен успешно."
            );

            $state.go('merchant.sites', {merchantId: r.id});
         },function(r){
            if(r.data.response && r.data.response.errors)
               $scope.errors = r.data.response.errors;
            else
               notifier.error("На сервере произошла ошибка! Попробуйте позже.")
         });
      };

      jQuery('.select2').select2();
   }])
/* all merchant users */
.controller('merchantUserListCtrl', ['$scope', '$stateParams', '$state','$http', function($scope, $stateParams, $state, $http) {
   $http.get(URL.USER.BASE($stateParams.merchantId)).then(function(r){
      $scope.users = r.data.response;
   });

   $scope.validateEmail = function(email){
      return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(email);
   }

   $scope.remove   = function(merchantId, userId) {
         $http.delete(URL.USER.ONE(merchantId, userId)).then(function(){
            $.each($scope.users, function(idx, user){
               if(user.id == userId){
                  $scope.users.splice(idx,1);
                  return false;
               }
            });
         });
   }
}])
/* add new merchant user */
.controller('merchantUserAddCtrl',  ['$scope', '$state', '$stateParams', '$http', 'notifier', function($scope, $state, $stateParams, $http, notifier) {
   $scope.actionType = 'create';

   var merchantId = $stateParams.merchantId;

   var user = $scope.user = {
      userName    : '',
      lastName    : '',
      firstName   : '',
      enabled     : true,
      roles       : [],
      rolesModel  : {}
   };

   $http.get(
      URL.ROLES
   ).then(function(r){
         var roles = r.data.response;
         $scope.roles = roles;
         $.each(roles, function(roleIdx,role){
            /* adding all roles and empty privileges by default */
            user.roles.push({
               roleEntry : role.roleEntry
               ,privileges: []
            });
            /* structure for checkboxes & ng-model + ng-checked */
            var userRole = user.rolesModel[role.roleEntry.code] = {};
            $.each(role.privileges, function(privilegeIdx, privilege){
               userRole[privilege.code] = false;
            })
         });
      });

   $scope.toggleRolePrivilege = function(role, privilege){
      /* searching for target role */
      $.each($scope.user.roles, function(userRoleIdx, userRole){
         if(userRole.roleEntry.id == role.roleEntry.id) {
            var deleted = false;
            /* searching for target privilege */
            $.each(userRole.privileges,function(userRolePrivilegeIdx, userRolePrivilege){
               /* drop privilege from target role if exists */
               if(userRolePrivilege.id == privilege.id){
                  userRole.privileges.splice(userRolePrivilegeIdx,1);
                  deleted = true;
                  return false;
               }
            });
            /* adding new privilege to target role */
            if(!deleted) userRole.privileges.push(privilege);
            return false;
         }
      });
   }

   $scope.errors = {};

   $scope.save     = function() {
      $http.put(URL.USER.BASE(merchantId), user).then(function(r){
         $scope.errors = {};
         notifier.info("Новый пользователь добавлен успешно.")
         $state.go('merchant.users', {merchantId: merchantId});
      }, function(r){
         if(r.data.response.errors)
            $scope.errors = r.data.response.errors;
         else
            notifier.error("Ошибка добавления пользователя! Попробуйте позже.");
      });
   };
}])
.controller('merchantUserEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'notifier', function($scope, $state, $stateParams, $http, notifier) {

   var merchantId      = $stateParams.merchantId;
   $scope.actionType = 'edit';
   $scope.merchantId   = merchantId;

   /* fetching user with userId */
   $http.get(URL.USER.ONE($stateParams.merchantId, $stateParams.userId)).then(function(r){
      var user = $scope.user = r.data.response;
      /* fetching all avaible roles */
      $http.get(URL.ROLES).then(function(r){
         var roles       = r.data.response;
         $scope.roles    = roles;
         user.rolesModel = {};
         /* filling model for checkboxes */
         $.each(roles, function(roleIdx,role){
            /* structure for checkboxes & ng-model + ng-checked */
            var userRole = user.rolesModel[role.roleEntry.code] = {};
            $.each(role.privileges, function(privilegeIdx, privilege){
               userRole[privilege.code] = false;
            })
         });
         $.each(user.roles, function(userRoleIdx, userRole){
            $.each(userRole.privileges||[], function(userRolePrivilegeIdx, userRolePrivilege){
               user.rolesModel[userRole.roleEntry.code][userRolePrivilege.code] = true;
            });

         });
      });
   });

   $scope.toggleRolePrivilege = function(role, privilege){
      /* searching for target role */
      $.each($scope.user.roles, function(userRoleIdx, userRole){
         if(userRole.roleEntry.id == role.roleEntry.id) {
            var deleted = false;
            /* searching for target privilege */
            $.each(userRole.privileges||[],function(userRolePrivilegeIdx, userRolePrivilege){
               /* drop privilege from target role if exists */
               if(userRolePrivilege.id == privilege.id){
                  userRole.privileges.splice(userRolePrivilegeIdx,1);
                  deleted = true;
                  return false;
               }
            });
            /* adding new privilege to target role */
            if(!deleted) {
               userRole.privileges = userRole.privileges||[];
               userRole.privileges.push(privilege);
            }
            return false;
         }
      });
   }

   $scope.errors = {};

   $scope.save     = function() {
      $http.put(URL.USER.BASE(merchantId), $scope.user).then(function(){
         $scope.errors = {};
         notifier.info("Пользователь отредактирован успешно.");
         $state.go('merchant.users', {merchantId: merchantId});
      },function(r){
         if(r.data.response.errors)
            $scope.errors = r.data.response.errors;
         else
            notifier.error("Ошибка редактирования пользователя! Попробуйте позже.");
      });
   };
}])
/* merchant sites */
.controller('merchantSiteListCtrl', ['$scope', '$stateParams', '$http', function($scope, $stateParams, $http) {

   var sites = [];

   $http.get(URL.WEBSITE.BASE($stateParams.merchantId)).then(function(r){
      sites = $scope.sites = r.data.response
   });

   $scope.remove   = function(merchantId, siteId) {
         $http.delete(URL.WEBSITE.ONE(merchantId, siteId)).then(function(){
            $.each(sites, function(siteIdx, site){
               if(site.id == siteId){
                  sites.splice(siteIdx,1);
                  return false;
               }
            })
         });
   }
}])
/* add new site to merchant */
.controller('merchantSiteAddCtrl',  ['$scope', '$state', '$stateParams', '$http', 'notifier', function($scope, $state, $stateParams, $http, notifier) {
   $scope.actionType = 'create';

   var site = $scope.site = {
      name       : '',
      url        : '',
      description: '',
      category   : '',
      setting    : {
         code           : RANDOM.string(10),
         key            : RANDOM.string(20),
         algorithm      : 'MD5',
         notifyType     : 'EMAIL',
         commission     : 0.0,
         succeedCallback: '',
         failureCallback: '',
         logo           : '',
         showLogo       : true
      }
   };
   $scope.errors = {};
   $scope.save     = function() {
      $http.put(URL.WEBSITE.BASE($stateParams.merchantId), site).then(function(){
         $scope.errors = {};
         notifier.info("Сайт добавлен успешно.");
         $state.go('merchant.sites', {merchantId: $stateParams.merchantId});
      },function(r){
         if(r.data.response.errors)
            $scope.errors = r.data.response.errors;
         else
            notifier.error("Ошибка добавления сайта! Попробуйте позже.");
      });
   }
}])
/* edit merchant site */
.controller('merchantSiteEditCtrl', ['$scope', '$state', '$stateParams', '$http', 'notifier', function($scope, $state, $stateParams, $http, notifier) {

   var site          = {};
   $scope.actionType = 'edit';

   $http.get(URL.WEBSITE.ONE($stateParams.merchantId, $stateParams.siteId)).then(function(r){
      site = $scope.site = r.data.response;
   });

   $scope.merchantId = $stateParams.merchantId;
   $scope.siteId     = $stateParams.siteId;

   $scope.errors = {};

   $scope.save     = function() {
      $http.put(URL.WEBSITE.BASE($stateParams.merchantId), site).then(function(){
         $scope.errors = {};
         notifier.info("Сайт отредактирован успешно.");
         $state.go('merchant.sites', {merchantId: $stateParams.merchantId});
      },function(r){
         if(r.data.response.errors)
            $scope.errors = r.data.response.errors;
         else
            notifier.error("Ошибка редактирования сайта! Попробуйте позже.");
      });
   }
}])
/* link pay system to merchant site */
.controller('merchantSitePayCtrl',  ['$scope', '$state', '$stateParams', '$http', 'notifier',function($scope, $state, $stateParams, $http, notifier) {
   $scope.systems = [];

   /* getting pay systems configuration for current site */
   $http.get(URL.WEBSITE.PAY($stateParams.merchantId, $stateParams.siteId)).then(function(r){
      /* filling model */
      $.each(r.data.response,function(siteSystemIdx,siteSystem){
         $scope.systems.push( siteSystem );
      })
   });

   $scope.merchantId = $stateParams.merchantId;

   /* save pay system settings for current site*/
   $scope.save     = function(system) {
      $http.put(
         URL.WEBSITE.PAY($scope.merchantId, $stateParams.siteId),angular.toJson(system)
      ).then(
         function(){
            notifier.info(
               "Настройки платежной системы изменены успешно."
            );
         }
         ,function(r){
            notifier.error("Ошибка изменений настроек платежной системы!");
            $state.go(
               'merchant.paySite'
               ,{merchantId: $scope.merchantId, siteId: $stateParams.siteId}
               ,{reload: true}
            );
         }
      );

      //$state.go('merchant.sites', {merchantId: $stateParams.merchantId}, {reload: true});
   };
}])
.controller('loginCtrl',  ['$scope', '$rootScope', '$state', 'AuthenticationService',
      function ($scope, $rootScope, $state, AuthenticationService) {
         // reset login status
         AuthenticationService.ClearCredentials();

         $scope.login = function () {
            $scope.dataLoading = true;
            AuthenticationService.Login($scope.username, $scope.password, function(response) {
               if(response.success) {
                  AuthenticationService.SetCredentials($scope.username, $scope.password);
                  $state.go('merchantAdd');
               } else {
                  $scope.error       = response.message;
                  $scope.dataLoading = false;
               }
            });
         };
      }])
.controller('adminAddCtrl',[function(){
   //TODO
}]);