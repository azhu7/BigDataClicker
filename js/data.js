/** Game values for the Player. */
function Player() {
	this.money = 1;
	this.moneyPerSecond = 0;
	this.netMoneyPerSecond = 0;
	this.moneyPerClick = 1;
	this.moneyPerAutoclick = 0;
	this.clickPower = 1;
	this.data = 0;
	this.dataPerSecond = 0;
	this.netDataPerSecond = 0;
	this.programs = 0;
	this.programsPerSecond = 0;
	this.costPerProgram = 5;
	this.clockCycleInMilliseconds = 3000;
	this.updateIntervalInMilliseconds = 1000;  // Player can increase this to reduce CPU usage
	
	/**
	 * Intro to CS, Assembly,
	 * Data Structures, C
	 */
	this.buildings = [
		new Building(1.1, 1, CostType.money, 1), new Building(1.2, 2, CostType.programs, 1),
		new Building(2.1, 11, CostType.money, 2), new Building(2.2, 22, CostType.programs, 2)
	];
	this.highestUnlockedTier = 2;
	this.numBuildingTypes = 2;
}

/** Constant strings. */
var strings = {
    savedPlayer: "playerSave",
    saveIntervalInMilliseconds: 10000,  // Automatically save every 10 seconds
    version: "0.0.1"
};