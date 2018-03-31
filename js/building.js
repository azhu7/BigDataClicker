/**
 * Author: Alexander Zhu
 * Date Created: March 14, 2018
 * Description: Building class for Big Data Clicker.
 */

/** Building constructor.
 * @param {Number} costFactor - Rate at which cost increases.
 * @param {Number} cost - Current cost.
 * @param {Currency} costType - Type of cost.
 * @param {Number} revenue - Current revenue.
 * @param {Currency} revenueType - Type of revenue.
 * @param {Number} owned - Total owned (manual + generated)
 * @param {Number} manual - // Number manually bought
 */
function Building(name, costFactor, cost, costType, revenue, revenueType, owned = 0, manual = 0) {
	this.name = name;
	this.costFactor = costFactor;
	this.cost = cost;
	this.costType = costType;
	this.revenue = revenue;
	this.revenueType = revenueType;
	this.owned = owned;
	this.manual = manual;
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