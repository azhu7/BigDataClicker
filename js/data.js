/**
 * Author: Alexander Zhu
 * Date Created: March 14, 2018
 * Description: Data for Big Data Clicker.
 */

/** Enum for currency types */
var Currency = Object.freeze({
	money:1,
	programs:2,
	data:3,
	rate:4,  // More rate = Lower clock cycle time
	building:5  // Generates its "child" building (all buildings above tier 1)
});

/** Game values for a default Player. */
function Player() {
	this.money = 1;
	this.moneyPerCycle = 0;
	this.netMoneyPerCycle = 0;
	this.moneyPerClick = 1;
	this.moneyPerAutoclick = 0;
	this.clickPower = 1;
	this.data = 0;
	this.dataPerCycle = 0;
	this.netDataPerCycle = 0;
	this.programs = 0;
	this.programsPerCycle = 0;
	this.costPerProgram = 5;
	this.clockCycleInMilliseconds = 3000;
	this.ratePerCycle = 0;
	this.updateIntervalInMilliseconds = 1000;  // Player can increase this to reduce CPU usage
	
	/**
	 * Intro to CS, Assembly, Turing Machine
	 * Data Structures, C, Computer
	 */
	this.buildings = [
		new Building(1.1, 1, Currency.money, 1, Currency.money), new Building(1.2, 2, Currency.money, 1, Currency.programs), new Building(1.3, 3, Currency.programs, 1, Currency.data), new Building(1.4, 4, Currency.money, 1, Currency.rate),
		new Building(2.1, 11, Currency.money, 2, Currency.building), new Building(2.2, 22, Currency.money, 2, Currency.building), new Building(2.3, 33, Currency.programs, 2, Currency.building), new Building(2.4, 44, Currency.money, 2, Currency.building),
	];
	this.highestUnlockedTier = 2;
	this.numBuildingTypes = 4;
}

function Debug() {
	this.loadSaved = false;
	this.autosave = false;
}

/** Constant strings. */
var strings = {
    savedPlayer: "playerSave",
    saveIntervalInMilliseconds: 10000,  // Automatically save every 10 seconds
    version: "0.0.3"
};