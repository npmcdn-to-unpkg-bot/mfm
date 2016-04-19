/**
* starter.services Module
*
* Description
*/
angular.module('starter.services')
.factory('Contracts', 
	['Restangular', 'PeopleServices', 'RealStates', '$ionicPopup', '$filter', 'toastr',
	function(Restangular, PeopleServices, RealStates, $ionicPopup, $filter, toastr) {

	// private
	var contractService = Restangular.all('Contracts');
	var renewService = Restangular.all('Renewals');

	// public
	var Contracts = {
		save: save,
		findByRealstateId: findByRealstateId,
		findAllByRealstateId: findAllByRealstateId,
		find: find,
		finish: finish,
		addDays: addDays
	};

	return Contracts;

	function findAllByRealstateId(id, month, year) {
		var monthFirstDay = year + '-' + month + '-' + '1';
		var monthLastDay = year + '-' + month + '-' + getDaysInMonth(parseInt(month), parseInt(year));
		var filter = {
			filter: JSON.stringify({
				where : { and :[
					{ realstateID: id }, 
					{
						or: [
							{and: [
								{ startDate: { gte: monthFirstDay }}, 
								{ startDate: {lte: monthLastDay}} 
							]},{
						and: [
							{ endDate: { gte: monthFirstDay }}, 
							{ endDate: {lte: monthLastDay}} 
						]},
						]
					}
					]},
				include: ['renewals']
			})
		}
		return contractService.getList(filter).then(function(contracts) {
			var monthSum = 0;
			for(var i = 0 ; i < contracts.length; i++) {
				var con = contracts[i];
				var startDate = new Date(con.startDate);
				var endDate = new Date(con.endDate);
				monthFirstDay = new Date(monthFirstDay);
				monthLastDay = new Date(monthLastDay);
				if(monthFirstDay > startDate) {
					con.startDate = monthFirstDay;
				}
				if(monthLastDay < endDate) {
					con.endDate = monthLastDay;
				}
				con.total = (daysDiff(con.startDate, con.endDate) * con.rentalFees);
				if(con.brokerCommissionPer > 0)
					con.brokerCommission = con.total * (con.brokerCommissionPer / 100);
				con.grandTotal = con.total - con.brokerCommission;
				monthSum += con.grandTotal;

				for(var r = 0; r < con.renewals.length; r++) {
					monthSum += con.renewals[r].total;
				}
			}
			return  { 
				contracts: Restangular.stripRestangular(contracts),
				monthSum: monthSum
			};
		});
	}

	function findByRealstateId(id){
		var filter = {
			filter: JSON.stringify({
				where : { realstateID: id },
				include: ['renter'],
				order: 'contractDate DESC',
				limit: 1
			})
		}
		return contractService.getList(filter).then(function(contract) {
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
		var confirmPopup = $ionicPopup.confirm({
			title: $filter('translate')('contractFinish.title'),
			template: $filter('translate')('contractFinish.template'),
			cancelText: $filter('translate')('contractFinish.cancel'),
       		okText: $filter('translate')('contractFinish.ok')
		});
		return confirmPopup.then(function(res){
			if(res) {
				//get the contract we want to finsih
				return find(id, ['realstate']).then(function(contract){
					return RealStates.release(contract.realstateID).then(function(rs) {
						toastr.success($filter('translate')('contracts.msgFinishSuccess'));
						return rs;
					})
				})
			}
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

	function getDaysInMonth(m, y) {
	    return m===2 ? y & 3 || !(y%25) && y & 15 ? 28 : 29 : 30 + (m+(m>>3)&1);
	}

	function daysDiff(_a, _b) {
		var a = moment(_a);
		var b = moment(_b);
		var diffDays = Math.round(b.diff(a, 'days', true));
		console.log(diffDays);
		return diffDays;
	}

}])