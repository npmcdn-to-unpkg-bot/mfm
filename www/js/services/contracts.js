/**
* starter.services Module
*
* Description
*/
angular.module('starter.services')
.factory('Contracts', ['Restangular', 'PeopleServices', 'RealStates', function(Restangular, PeopleServices, RealStates){
	// private
	var contractService = Restangular.all('Contracts');
	var renewService = Restangular.all('Renewals');

	// public
	var Contracts = {
		save: save,
		findByRealstateId: findByRealstateId,
		find: find,
		finish: finish,
		addDays: addDays
	};

	function findByRealstateId(id){
		var filter = {
			filter: JSON.stringify({
				where : { realstateID: id },
				include: ['renter'],
				order: 'contractDate DESC',
				limit: 1
			})
		}
		return contractService.getList(filter).then(function(contract){
			return Restangular.stripRestangular(contract)[0];
		});
	}

	function find(id, includes) {
		var qryParams;
		if(includes)
			qryParams = { 
				filter: JSON.stringify({
					include: includes
				})
			};

		return contractService.get(id, qryParams).then(function(contract){
			return Restangular.stripRestangular(contract);
		})
	}

	function finish(id) {
		//get the contract we want to finsih
		return find(id, ['realstate']).then(function(contract){
			return RealStates.release(contract.realstateID)
		})
	}

	function save(model)
	{
		console.log('saving');
		console.log(model);
		console.log(model.realstate)
		var contractModel = {
		 	id: 0,
		 	realstateID: model.realstate.id,
		    contractDate: formatDate(model.contractDate),
		 	startDate: formatDate(model.startDate),
		 	endDate: formatDate(model.endDate),
		    companion1name: model.companion1name,
		    companion1phone: model.companion1phone,
		    companion2name: model.companion2name,
		    companion2phone: model.companion2phone,
		    companion3name: model.companion3name,
		    companion3phone: model.companion3phone,
		    brokerCommissionPer: model.brokerCommission,
		    brokerCommission: model.brokerFees,
		 	rentalFees: model.realstate.rentalFees,
		    durationInDays: model.durationInDays,
		    total: model.total,
		    discount: model.discount,
		    grandTotal: model.grandTotal,
		};

		// ---------------------------------------------
		// Adding the renterId
		console.log('adding the renter id');
		// Check renter is new or selected from list
		if ( model.renter.id ){
			console.log('renter_id exists');
			// existing renter
			contractModel.renterID = model.renter.id
		}
		// new renter
		else{
			console.log('createing new person to get the renter_id');
			People.create(model.renter).then(function(personModel){
				contractModel.renterID = personModel.id;
			});
		}
		// ---------------------------------------------
		// Adding the brokerId
		console.log('adding the brokerId');
		// Check broker is new or selected
		if ( model.broker && model.broker.name){
			if (model.broker.id){
				console.log('brokerId exists');
				// existing broker
				contractModel.brokerID = model.broker.id
			}
			// new renter
			else{
				console.log('createing new person to get the brokerId');
				People.create(model.broker).then(function(personModel){
					contractModel.brokerId = personModel.id;
				});
			}
		}
		// Save
		console.log(contractModel);
		return contractService.post(contractModel).then(function(model){
			return model;
		})
	}

	function formatDate(date){
		return moment(date).format('YYYY-MM-DD');
	}

	function addDays(date, days) {
	    var result = new Date(date);
	    result.setDate(result.getDate() + days);
	    return result;
	}

	return Contracts;
}])