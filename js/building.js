var CostType = Object.freeze({money:1, programs:2});

function Building(costFactor, cost, costType, revenue, owned = 0, manual = 0) {
	this.costFactor = costFactor;
	this.cost = cost;
	this.costType = costType;
	this.revenue = revenue;
	this.owned = owned;  // Total owned (manual + generated)
	this.manual = manual;  // Number manually bought
}

Building.prototype.generateAdd = function(num) {
	this.owned += num;
	var cost = this.cost;
	this.cost += num;

	return cost;
};

Building.prototype.manualAdd = function(num) {
	this.manual += num;
	return this.generateAdd(num);
};

Building.prototype.payout = function(num) {
	return this.owned * this.revenue;
};