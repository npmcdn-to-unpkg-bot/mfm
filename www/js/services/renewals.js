angular.module('starter.services')

.factory('Renewals', function(Restangular){
	// private 
	var renewalService = Restangular.all('Renewals');

	//public
	var renewal = {
		all: all,
		find: find,
		save: save,
		update: update,
		remove: remove,
	};

	return renewal;

	function all (_contractId) {
		var qryParams = {
			filter: JSON.stringify({
				where: {
					contractID: _contractId
				}
			})
		}
		return renewalService.getList(qryParams);
	}

	function save (renewalModel) {
		return renewalService.post(renewalModel).then(function(_ren){
			return Restangular.stripRestangular(_ren);
		})
	}

	function find(_id) {
		return renewalService.get(_id).then(function(renewalModel){
			return reforamt(renewalModel)
		})
	}

	function update(renewalModel) {
		return renewalModel.put().then(function(renewalModel){
			return reforamt(renewalModel)
		})
	}

	function remove(renewalModel) {
		return renewalModel.remove().then(function(renewal){
			return renewal;
		})
	}

	function reforamt(renewalModel) {
		renewalModel.renewalDate = new Date(renewalModel.renewalDate);
		renewalModel.endDate = new Date(renewalModel.endDate);
		return renewalModel;
		// return Restangular.stripRestangular(renewalModel);	
	}

})