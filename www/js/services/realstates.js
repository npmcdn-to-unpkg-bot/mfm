angular.module('starter.services', ['restangular', 'toastr'])

.factory('RealStates', function(Restangular, $q) {

  // private
  var realStatesService = Restangular.all('Realstates');
  var realStates;

  // public
  return {
    all: all,
    remove: remove,
    release: release,
    get: get, 
    income: income
  };

  function all () {
    return realStatesService.getList().then(function(list){
      // realStates = Restangular.stripRestangular(list);
      realStates = list;
      return realStates;
    });
  }

  function remove(realstate) {
    // shold make delete request !!!!😓
    realStates.splice(realStates.indexOf(realstate), 1);
  }

  function release(id) {
    return get(id).then(function(realstate){
      realstate.endDate = null;
      realstate.state = 'vacant';
      return realstate.put().then(function(updatedRealstate){
        return updatedRealstate;
      });
    })
  }

  function get(realstateId) {
    var deferred = $q.defer();
    if(realStates) {
      for (var i = 0; i < realStates.length; i++) {
        if (realStates[i].id === parseInt(realstateId)) {
          deferred.resolve(realStates[i]);
        }
      }
    }
    else {
      return realStatesService.get(realstateId).then(function(realstate) {
        return realstate;
      })
    }
    return deferred.promise;
  }

  function income(realstateID, year) {
    return realStatesService.customGET('income', {id: realstateID, year: year});
  }

});
