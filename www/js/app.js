// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'restangular', 'mgo-angular-wizard', 'pascalprecht.translate'])

.run(function($ionicPlatform, $rootScope, $state, Navigator, $rootScope, $translate) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });

  $rootScope.currentLanguage = $translate.use();
})

.config(function($stateProvider, $urlRouterProvider, RestangularProvider, $translateProvider, $ionicConfigProvider) {

  $ionicConfigProvider.views.transition('none');

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })

  .state('app.dash', {
    url: '/dash',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-dash.html',
        controller: 'DashCtrl'
      }
    }
  })

  .state('app.realstates', {
      url: '/realstates',
      views: {
        'menuContent': {
          templateUrl: 'templates/realstates.html',
          controller: 'RealstatesController'
        }
      }
    })

    .state('app.realstate-detail', {
      url: '/realstates/:realstateId',
      views: {
        'menuContent': {
          templateUrl: 'templates/realstate-detail.html',
          controller: 'RealstateDetailController'
        }
      }
    })

    // Realstate => Inceom 
    .state('app.realstate-income', {
      url: '/realstates/:realstateId/income',
      views: {
        'menuContent': {
          templateUrl: 'templates/realstate-income.html',
          // controller: 'RealstateIncomeController'
        }
      }
    })
    // Realstate => Expanses 
    .state('app.realstate-expanses', {
      url: '/realstates/:realstateId/expanses',
      views: {
        'menuContent': {
          templateUrl: 'templates/realstate-expanses.html',
          // controller: 'RealstateIncomeController'
        }
      }
    })

  .state('app.account', {
    url: '/account',
    views: {
      'menuContent': {
        templateUrl: 'templates/tab-account.html',
        controller: 'AccountCtrl'
      }
    }
  })

  .state('app.contract-new', {
    url: '/contracts/new/:realstateId',
    views: {
      'menuContent': {
        templateUrl: 'templates/contracts/contract-new.html',
        controller: 'ContractController'
      }
    }
  })

  .state('app.contract-view', {
    url: '/contracts/:contractId',
    views: {
      'menuContent': {
        templateUrl: 'templates/contracts/contract-view.html',
        controller: 'ContractViewController'
      }
    }
  })

  .state('app.renewal-new', {
    url: '/contracts/:contractId/renew',
    views: {
      'menuContent': {
        templateUrl: 'templates/renewals/renewal-new.html',
        controller: 'RenewNewController'
      }
    }
  })

  .state('app.renewal-view', {
    url: '/contracts/:contractId/renew/:renewalId',
    views: {
      'menuContent': {
        templateUrl: 'templates/renewals/renewal-view.html',
        controller: 'RenewalViewController'
      }
    }
  })
  .state('app.renewal-edit', {
    url: '/contracts/:contractId/renew/:renewalId/edit',
    views: {
      'menuContent': {
        templateUrl: 'templates/renewals/renewal-new.html',
        controller: 'RenewalEditController'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/realstates');


  // Change the URL where to access the LoopBack REST API server
  RestangularProvider.setBaseUrl('http://0.0.0.0:3000/api');

  // ************* TRANSLATION **********************
  $translateProvider.preferredLanguage('ar');
  
  $translateProvider.translations('en', {
    'TITLE': 'Realstates',
    'FOO': 'This is a paragraph',
    'realstates.vacant': 'Vancat',
    'menu.title': 'Main Menu',
    'realstateDetails.title': 'Realstate details'
  });

  $translateProvider.translations('ar', {
    'TITLE': 'العقارات',
    'FOO': 'غضد مبلك عربي',
    'realstates.vacant': 'شاغر',
    'menu.title': 'القائمه الرئيسيه',
    'realstateDetails.title': 'تفاصيل العقار',
    'realstate.name': 'اسم / رقم الغقار',
    'realstate.building': 'اسم المبنى',
    'realstate.address': 'العنوان',
    'realstate.status': 'حالة العقار',
    'realstateDetails.rent' : 'أجر العقار',
    'realstateDetails.expanses' : 'المنصرفات',
    'realstateDetails.income' : 'الايرادات',
  });

});
