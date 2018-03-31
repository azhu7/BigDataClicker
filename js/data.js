/**
 * Author: Alexander Zhu
 * Date Created: March 14, 2018
 * Description: Data for Big Data Clicker.
 */

/** Enum for currency types. */
var Currency = Object.freeze({
	money:1,
	programs:2,
	data:3,
	click:4,  // Money per click
	rate:5,  // More rate = Lower clock cycle time
	building:6  // Generates its "child" building (all buildings above tier 1)
});

/** Game values for a default Player. */
function Player() {
	this.money = 1;
	this.moneyPerCycle = 0;
	this.netMoneyPerCycle = 0;
	this.moneyPerClick = 1;
	this.baseMoneyPerClick = 1;
	this.moneyPerAutoclick = 0;
	this.clickPower = 1;
	this.data = 0;
	this.dataPerCycle = 0;
	this.netDataPerCycle = 0;
	this.programs = 0;
	this.programsPerCycle = 0;
	this.costPerProgram = 2;
	this.clockCycleInMilliseconds = 3000;
	this.ratePerCycle = 0;
	this.updateIntervalInMilliseconds = 1000;  // Player can increase this to reduce CPU usage
	
	/**
	 * Intro to CS, Assembly, Turing Machine, Database, Software Engineer
	 * Data Structures, C, Computer
	 */
	this.buildings = [
		new Building("Intro to CS", 1.1, 1, Currency.money, 1, Currency.money), new Building("Assembly", 1.2, 2, Currency.money, 1, Currency.programs), new Building("Turing Machine", 1.3, 3, Currency.programs, 1, Currency.data), new Building("Data Modeling", 1.4, 4, Currency.data, 1, Currency.money), new Building("Intern", 1.5, 5, Currency.money, 1, Currency.click), new Building("CS Normie", 1.6, 6, Currency.money, 1, Currency.rate),
		new Building("Data Structures", 2.1, 11, Currency.money, 2, Currency.building), new Building("C", 2.2, 22, Currency.money, 2, Currency.building), new Building("Computer", 2.3, 33, Currency.programs, 2, Currency.building), new Building("Edsger Dijkstra", 2.4, 44, Currency.data, 2, Currency.building), new Building("Front-End Guru", 2.5, 55, Currency.money, 2, Currency.building), new Building("Edsger Dijkstra", 2.6, 66, Currency.money, 2, Currency.building)
	];
	this.highestUnlockedTier = 2;
	this.numBuildingTypes = 6;
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