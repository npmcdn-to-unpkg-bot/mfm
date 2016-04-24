
  // Change the URL where to access the LoopBack REST API server
  // var burl = 'http://192.168.1.70:3000/api'
  var burl = 'http://192.168.1.77:3000/api'
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'restangular', 
  'mgo-angular-wizard', 'pascalprecht.translate', 'toastr', 'ionic-native-transitions'])

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

.config(function($stateProvider, $urlRouterProvider, RestangularProvider, $translateProvider, 
  $ionicConfigProvider, toastrConfig, $ionicNativeTransitionsProvider) {

  // $ionicConfigProvider.views.transition('none');
  // $ionicConfigProvider.scrolling.jsScrolling(false);

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
          controller: 'RealstateIncomeController'
        }
      }
    })

    // Realstate => Inceom details 
    .state('app.realstate-income-details', {
      url: '/realstates/:realstateId/income/{year}/{month}',
      views: {
        'menuContent': {
          templateUrl: 'templates/realstate-income-details.html',
          controller: 'RealstateIncomeDetailController'
        }
      }
    })
    // Realstate => Expenses 
    .state('app.realstate-expenses', {
      url: '/realstates/:realstateId/expenses',
      views: {
        'menuContent': {
          templateUrl: 'templates/realstate-expenses.html',
          controller: 'RealstateExpensesController'
        }
      }
    })

    // Realstate => expense details 
    .state('app.realstate-expense-details', {
      url: '/realstates/:realstateId/expense/{year}/{month}',
      views: {
        'menuContent': {
          templateUrl: 'templates/realstate-expense-details.html',
          controller: 'RealstateExpenseDetailController'
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

  $ionicNativeTransitionsProvider.setDefaultTransition({
    type: 'slide',
    direction: 'right'
  });

   $ionicNativeTransitionsProvider.setDefaultBackTransition({
        type: 'slide',
        direction: 'left'
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/realstates');


  
  RestangularProvider.setBaseUrl(burl);

  // TOASTER !! - notifications
  angular.extend(toastrConfig, {
    positionClass: 'toast-top-center',
  });

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
    'menu.title': 'القائمه الرئيسيه',
    'menu.goBack': 'رجوع',

    'realstates.vacant': 'شاغر',
    'realstates.full': 'مؤجرة',

    'realstate.name': 'اسم / رقم العقار',
    'realstate.building': 'اسم المبنى',
    'realstate.address': 'العنوان',
    'realstate.status': 'حالة العقار',
    
    'realstateDetails.title': 'تفاصيل العقار',
    'realstateDetails.rent' : 'عمل ايجار جديد',
    'realstateDetails.expenses' : 'المنصرفات',
    'realstateDetails.income' : 'الايرادات',
    'realstateDetails.contractSummary' : 'ملخص العقد الحالي',
    'realstateDetails.renter' : 'المستأجر',
    'realstateDetails.remainingDays' : 'الايام المتبقية',
    'realstateDetails.duration' : 'مدة الاقامة',
    'realstateDetails.viewContract' : 'عرض العقد',
    'realstateDetails.renewContract' : 'تمديد',
    'realstateDetails.finishContract' : 'انهاء العقد',
    'realstateDetails.editRealstate' : 'تعديل  بيانات العقار',


    'newContract.title' : 'عقد جديد',
    'newContract.date' : 'تاريخ العقد',
    'newContract.selectRenter' :'اختر المستأجر',
    'newContract.addCompanion' : 'اضافة مرافق',
    'newContract.selectBroker' : 'اختر السمسار',
    'newContract.startDate' : 'من يوم',
    'newContract.endDate' : 'الى يوم',
    'contract.numberOfDays' : 'عدد الايام',
    'contract.rentalFees' : 'سعر اليوم',
    'newContract.save' : 'حفظ',
    'newContract.renter' : 'المستاجر',
    'newContract.broker' : 'السمسار',
    'newContract.msgSaveSuccess' : 'تم عمل العقد بنجاح',
    
    'contract.total' : 'المجموع',
    'contract.discount' : 'التخفيض',
    'contract.brokerFees' : 'عمولة السمسار',
    'contract.grandTotal' : 'المجموع الكلي',

    'contracts.msgFinishSuccess': 'تم انهاء العقد بنجاح',

    'personSelectModal.search' : 'البحث',
    'personSelectModal.cancel' : 'الغاء',
    'personSelectModal.newRenter' : 'مستاجر جديد',
    'personSelectModal.newBroker' : 'سمسار جديد',

    'personNewModal.name' : 'الاسم',
    'personNewModal.phone' : 'التلفون',
    'personNewModal.address' : 'العنوان',
    'personNewModal.addPerson' : 'اضافة شخص',
    'personNewModal.save' : 'حفظ',
    
    'companionModal.title' : 'اضافة مرافق',
    'companionModal.name' : 'اسم المرافق',
    'companionModal.phone' : 'تلفون المرافق',
    'companionModal.addButton' : 'اضافة',

    'contractView.contract' : 'عقد',
    'contractView.realstateInfo' : 'العقار المؤجر',
    'contractView.realstateName' : 'اسم العقار',
    'contractView.building' : 'المبنى',
    'contractView.more' : 'المزيد',
    'contractView.renterInfo' : 'يبانات المستأجر',
    'contractView.name' : 'الاسم',
    'contractView.phone' : 'التلفون',
    'contractView.singularOfcompanion' : 'المرافق',
    'contractView.pluralOfCompanion' : 'المرافقين',
    'contractView.companion1Name' : 'المرافق ١',
    'contractView.companionPhone' : 'تلفون',
    'contractView.companion2Name' : 'المرافق ٢',
    'contractView.companion3Name' : 'المرافق ٣',
    'contractView.duration' : 'مدة الاقامة',
    'contractView.durationInDays' : 'المدة بالايام',
    'contractView.startDate' : 'من يوم',
    'contractView.endDate' : 'الى يوم',
    'contractView.brokerInfo' : 'بيانات السمسار',
    'contractView.address' : 'المكتب',
    'contractView.days' : 'يوم',
    'contractView.Renew' : 'تمديد',
    'contractView.Finish' : 'انهاء',
    'contractView.getReport' : 'طباعة العقد',
    'contractView.contractRenewals' : 'التجديدات',
    'contractView.until' : 'حتى',
    'contractView.editLatestRenewal' : 'تعديل آخر تجديد',
    'contractView.day' : 'يوم',
    'contractView.days' : 'يوم',

    'renewalNew.title' : 'تمديد ايجار',
    'renewalNew.renewalDate' : 'تمديد ايجار',
    'renewalNew.endDate' : 'المبنى',
    'renewalNew.days' : 'عدد ايام التجديد',
    'renewalNew.renew' : 'عمل التجديد',
    'renewalNew.update' : 'حفظ التعديل',
    'renewalNew.delete' : 'مسح التجديد',
    'renewalNew.popupTitle' : 'مسح التجديد؟',
    'renewalNew.popupTemplate' : 'هل تريد مسح التجديد؟',
    'renewalNew.cancel' : 'لا',
    'renewalNew.ok' : 'نعم',
    'renewalNew.msgUpdateSuccess' : 'تم حفظ التعديل',
    'renewalNew.msgRemoveSuccess' : 'تم حذف التجديد',
    'renewalNew.msgRenewSuccess' : 'تم عمل التجديد',


    'contractFinish.template' : 'هل ترغب في اتهاء العقد؟',
    'contractFinish.title' : 'اتهاء العقد؟',
    'contractFinish.cancel' : 'لا',
    'contractFinish.ok' : 'نعم',

    'expenses.title': 'المنصرفات',
    'expenses.description': 'الوصف',
    'expenses.amount': 'القيمة',
    'expenses.addExpense': 'اضافة منصرف',


    'income.title': 'الايرادات',
    'income.duration': 'الفترة',
    'income.total': '',
    'month1': 'يناير',
    'month2': 'فبراير',
    'month3': 'مارس',
    'month4': 'ابريل',
    'month5': 'مايو',
    'month6': 'يونيو',
    'month7': 'يوليو',
    'month8': 'اغسطس',
    'month9': 'سبتمبر',
    'month10': 'اكتوبر',
    'month11': 'نوفمبر',
    'month12': 'ديسمبر',

    // TODO: remove sample data
    'income.sampleMonth': 'فبراير',
    'income.duration': 'المدة',
    'income.amount': 'القيمة',
    'income.total': 'المجموع',

  });

});
