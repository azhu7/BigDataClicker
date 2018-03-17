/**
 * Author: Alexander Zhu
 * Date Created: March 14, 2018
 * Description: Data for Big Data Clicker.
 */

/** Enum for currency types */
var Currency = Object.freeze({money:1, programs:2});

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
	this.updateIntervalInMilliseconds = 1000;  // Player can increase this to reduce CPU usage
	
	/**
	 * Intro to CS, Assembly,
	 * Data Structures, C
	 */
	this.buildings = [
		new Building(1.1, 1, Currency.money, 1, Currency.money), new Building(1.2, 2, Currency.money, 1, Currency.programs),
		new Building(2.1, 11, Currency.money, 2, Currency.money), new Building(2.2, 22, Currency.money, 2, Currency.programs)
	];
	this.highestUnlockedTier = 2;
	this.numBuildingTypes = 2;
}

/** Constant strings. */
var strings = {
    savedPlayer: "playerSave",
    saveIntervalInMilliseconds: 10000,  // Automatically save every 10 seconds
    version: "0.0.2"
};