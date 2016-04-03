angular.module('starter.controllers', ['mgo-angular-wizard'])


.factory('RealstateDetailsService', function(RealStates, Contracts){
  var rss = {
      buildings: [],
      realStates: [],
      getRealstates: getRealstates,
      refreshData: refreshData
    };
  return rss;

  function refreshData(){
    return getRealstates();
  }

  function getRealstates() {
    return RealStates.all().then(function(list){
      rss.buildings.splice(0, rss.buildings.length);
      rss.realStates.splice(0, rss.realStates.length);

      var map = new Map();
      // create buildings - used for realstate grouping
      for (var i = 0; i < list.length; i++){
        // adding realstates
        rss.realStates.push(list[i]);
        // check if realsatate in differnt building
        if (rss.buildings.indexOf(list[i].building) < 0){
          rss.buildings.push(list[i].building);
        }
        
        // Badge 
        if(rss.realStates[i].state === 'full') 
        {
          var remainingDays = rss.realStates[i].remainingDays;
          if(remainingDays <= 0)
            rss.realStates[i].badgeType = 'badge-assertive'; 
          else if(remainingDays >= 0 && remainingDays <= 3)
            rss.realStates[i].badgeType = 'badge-energized'; 
          else if(remainingDays > 3)
            rss.realStates[i].badgeType = 'badge-calm';  
        } 
        else {
          rss.realStates[i].badge = 'vacant';
          rss.realStates[i].badgeType = 'badge-balanced';  
        } 

      }
      return list;
    });
  }
})

.controller('DashCtrl', function($scope) {})

// ==================== ============= ============= ============== 
.controller('RealstatesController', function($scope, RealStates, RealstateDetailsService, Contracts, $translate) {

  $scope.buildings = RealstateDetailsService.buildings;
  $scope.realStates = RealstateDetailsService.realStates;

  if(RealstateDetailsService.realStates.length <= 0){
    RealstateDetailsService.getRealstates();
  }

  $scope.refreshDate = function() {  
    RealstateDetailsService.refreshData();
  }

  $scope.getIcon = function () {

    if ($translate.use() === 'ar') {
      return 'ion-chevron-left'
    }
    return 'ion-chevron-right'
  }

})


// ********************************************************
.controller('AccountCtrl', function($scope, RealstateDetailsService) {
  $scope.refreshDate = function(){
    RealstateDetailsService.refreshData();  
  };
});
