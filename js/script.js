/**
 * Author: Alexander Zhu
 * Date Created: March 14, 2018
 * Description: Main game logic for Big Data Clicker.
 */

var player = {};
var debug = new Debug();

/* -- Helper functions -- */

/** Initialize player. */
function init() {
    if (debug.loadSaved) {
        if (localStorage.getItem(strings.savedPlayer)) {
            console.log("Found saved file. Loading.");
            load();
        }
        else {
            player = new Player();
        }
    }
    else {
        console.warn("Loading is turned off for development purposes.");
        player = new Player();
    }
}

/** Format number for displaying.
 * @param  {number} num - Number to display.
 * @param  {string} prefix - Prefix of number.
 * @param  {string} suffix - Suffix of number.
 * @return {string} Formatted number.
 */
function showNum(num, {prefix = "", suffix = ""} = {}) {
    var suffixDelimiter = suffix == "" ? "" : " ";  // Add a space if needed
    return `${prefix}${num.toFixed(2)}${suffixDelimiter}${suffix}`;
}

/** Add specified amount of money to player.
 * @param {Currency} type - Type of currency.
 * @param {number} amount - Amount to add.
 */
function addCurrency(type, amount) {
    switch (type) {
        case Currency.money:
            player.money = Math.max(player.money + amount, 0);
            break;
        case Currency.programs:
            player.programs = Math.max(player.programs + amount, 0);
            break;
        case Currency.data:
            player.data = Math.max(player.data + amount, 0);
            break;
        case Currency.rate:
            // More rate = Lower clock cycle time
            player.clockCycleInMilliseconds = Math.max(player.clockCycleInMilliseconds - amount, 0);
            break;
        default:
            console.error(`addCurrency: unrecognized type ${type}.`);
    }
}

/** Add one click's worth of money to player.
 * @param  {number} clickPower - Click multiplier.
 */
function moneyButtonClick(clickPower) {
    var amountEarned = player.moneyPerClick * clickPower;
    addCurrency(Currency.money, amountEarned);
}

/** Return true if can afford the building.
 * @param  {Building} building - The building user is trying to buy.
 * @return {bool} Whether the player can afford the building or not.
 */
function canAfford(building) {
    var playerCurrency;
    switch (building.costType) {
        case Currency.money:
            playerCurrency = player.money;
            break;
        case Currency.programs:
            playerCurrency = player.programs;
            break;
        case Currency.data:
            playerCurrency = player.data;
            break;
        default:
            console.error(`canAfford: unrecognized type ${building.costType}.`);
    }

    return playerCurrency >= building.cost;
}

/** Buy a building, if can afford.
 * @param  {number} row - Row of building to buy.
 * @param  {number} col - Column of building to buy.
 * @param  {number} amount - Number of buildings to buy.
 */
function buyBuilding(index, amount = 1) {
    if (canAfford(player.buildings[index])) {
        cost = player.buildings[index].manualAdd(amount);
        addCurrency(player.buildings[index].costType, -cost);
        console.log("Successfully bought a building.");
    }
    else {
        console.log("Cannot afford the building.");
    }
}

/* -- Game iterations -- */

/** Iterate all game values. */
function iterateAll() {
    computeBuildings();
    computePlayerNetRevenue();
    applyPlayerNetRevenue();
}

/** Compute player net revenues. */
function computePlayerNetRevenue() {
    // Money + Programs per cycle
    player.moneyPerCycle = player.buildings[0].payout() + player.buildings[3].payout();
    player.programsPerCycle = player.buildings[1].payout();
    player.netMoneyPerCycle = player.moneyPerCycle - player.programsPerCycle*player.costPerProgram;

    // Data per cycle
    player.netDataPerCycle = player.dataPerCycle = player.buildings[2].payout();

    // Money per click
    player.moneyPerClick = player.clickPower * (player.baseMoneyPerClick + player.buildings[4].payout());

    // Clock rate
    player.ratePerCycle = player.buildings[5].payout();
}

/** Apply player net revenues. */
function applyPlayerNetRevenue() {
    var canAffordPrograms = (player.money + player.netMoneyPerCycle) >= 0;
    if (canAffordPrograms) {
        // Can afford, buy all programs
        addCurrency(Currency.money, player.netMoneyPerCycle);
        addCurrency(Currency.programs, player.programsPerCycle);
    }
    else {
        // Can't afford, buy as many programs as possible
        var playerMoney = player.money + player.moneyPerCycle;
        var maxAffordablePrograms = Math.floor(playerMoney / player.costPerProgram);
        addCurrency(Currency.money, player.moneyPerCycle - maxAffordablePrograms * player.costPerProgram);
        addCurrency(Currency.programs, maxAffordablePrograms);
    }

    // Add data
    addCurrency(Currency.data, player.netDataPerCycle);

    // Add rate
    addCurrency(Currency.rate, player.ratePerCycle);
}

/** Compute new number of buildings. */
function computeBuildings() {
    var rowLen = player.numBuildingTypes;
    for (var i = 0; i < rowLen; i++) {
        // Generate lower tier buildings from higher tiers
        for (var j = player.highestUnlockedTier - 1; j > 0; j--) {
            player.buildings[i + (j-1)*rowLen].owned += player.buildings[i + j*rowLen].payout();
        }
    }
}

/** Refresh all html values. */
function refreshAll() {
	refreshData();
    refreshInventory();
}

/** Refresh html data. */
function refreshData() {
    var dataTableTemplate = _.template($("#dataTableTemplate").html());
	var newDataTable = dataTableTemplate({
		money: showNum(player.money),
		moneyPerCycle: showNum(player.moneyPerCycle),
		netMoneyPerCycle: showNum(player.netMoneyPerCycle),
		moneyPerClick: showNum(player.moneyPerClick),
		moneyPerAutoclick: showNum(player.moneyPerAutoclick),
		data: showNum(player.data),
		dataPerCycle: showNum(player.dataPerCycle),
		netDataPerCycle: showNum(player.netDataPerCycle),
		programs: showNum(player.programs),
		programsPerCycle: showNum(player.programsPerCycle),
        costPerProgram: showNum(player.costPerProgram),
		clockCycleInMilliseconds: showNum(player.clockCycleInMilliseconds),
	});

	$("#info").html(newDataTable);
}

/** Refresh html inventory. */
function refreshInventory() {
    var buildingInfoTemplate = _.template($("#buildingInfoTemplate").html());
    var clickBuildingInfoTemplate = _.template($("#clickBuildingInfoTemplate").html());
    var rateBuildingInfoTemplate = _.template($("#rateBuildingInfoTemplate").html());

    var building0 = buildingInfoTemplate({
        name: player.buildings[0].name,
        revenue: showNum(player.buildings[0].revenue, {prefix: "$"}),
        cost: showNum(player.buildings[0].cost, {prefix: "$"}),
        owned: showNum(player.buildings[0].owned),
        manual: showNum(player.buildings[0].manual)
    });

    var building1 = buildingInfoTemplate({
        name: player.buildings[1].name,
        revenue: showNum(player.buildings[1].revenue, {suffix: "programs"}),
        cost: showNum(player.buildings[1].cost, {prefix: "$"}),
        owned: showNum(player.buildings[1].owned),
        manual: showNum(player.buildings[1].manual)
    });

    var building2 = buildingInfoTemplate({
        name: player.buildings[2].name,
        revenue: showNum(player.buildings[2].revenue, {suffix: "data"}),
        cost: showNum(player.buildings[2].cost, {suffix: "programs"}),
        owned: showNum(player.buildings[2].owned),
        manual: showNum(player.buildings[2].manual)
    });

    var building3 = buildingInfoTemplate({
        name: player.buildings[3].name,
        revenue: showNum(player.buildings[3].revenue, {prefix: "$"}),
        cost: showNum(player.buildings[3].cost, {suffix: "data"}),
        owned: showNum(player.buildings[3].owned),
        manual: showNum(player.buildings[3].manual)
    });

    var building4 = clickBuildingInfoTemplate({
        name: player.buildings[4].name,
        revenue: showNum(player.buildings[4].revenue, {prefix: "$"}),
        cost: showNum(player.buildings[4].cost, {prefix: "$"}),
        owned: showNum(player.buildings[4].owned),
        manual: showNum(player.buildings[4].manual)
    });

    var building5 = rateBuildingInfoTemplate({
        name: player.buildings[5].name,
        cost: showNum(player.buildings[5].cost, {prefix: "$"}),
        owned: showNum(player.buildings[5].owned),
        manual: showNum(player.buildings[5].manual)
    });

    var building6 = buildingInfoTemplate({
        name: player.buildings[6].name,
        revenue: showNum(player.buildings[6].revenue, {suffix: player.buildings[6-player.numBuildingTypes].name}),
        cost: showNum(player.buildings[6].cost, {prefix: "$"}),
        owned: showNum(player.buildings[6].owned),
        manual: showNum(player.buildings[6].manual)
    });

    var building7 = buildingInfoTemplate({
        name: player.buildings[7].name,
        revenue: showNum(player.buildings[7].revenue, {suffix: player.buildings[7-player.numBuildingTypes].name}),
        cost: showNum(player.buildings[7].cost, {prefix: "$"}),
        owned: showNum(player.buildings[7].owned),
        manual: showNum(player.buildings[7].manual)
    });

    var building8 = buildingInfoTemplate({
        name: player.buildings[8].name,
        revenue: showNum(player.buildings[8].revenue, {suffix: "data"}),
        cost: showNum(player.buildings[8].cost, {suffix: player.buildings[8-player.numBuildingTypes].name}),
        owned: showNum(player.buildings[8].owned),
        manual: showNum(player.buildings[8].manual)
    });

    var building9 = buildingInfoTemplate({
        name: player.buildings[9].name,
        revenue: showNum(player.buildings[9].revenue, {suffix: player.buildings[9-player.numBuildingTypes].name}),
        cost: showNum(player.buildings[9].cost, {suffix: "data"}),
        owned: showNum(player.buildings[9].owned),
        manual: showNum(player.buildings[9].manual)
    });

    var building10 = buildingInfoTemplate({
        name: player.buildings[10].name,
        revenue: showNum(player.buildings[10].revenue, {suffix: player.buildings[10-player.numBuildingTypes].name}),
        cost: showNum(player.buildings[10].cost, {prefix: "$"}),
        owned: showNum(player.buildings[10].owned),
        manual: showNum(player.buildings[10].manual)
    });

    var building11 = buildingInfoTemplate({
        name: player.buildings[11].name,
        revenue: showNum(player.buildings[11].revenue, {suffix: player.buildings[11-player.numBuildingTypes].name}),
        cost: showNum(player.buildings[11].cost, {prefix: "$"}),
        owned: showNum(player.buildings[11].owned),
        manual: showNum(player.buildings[11].manual)
    });

    $("#class1").html(building0);
    $("#lang1").html(building1);
    $("#hardware1").html(building2);
    $("#data1").html(building3);
    $("#career1").html(building4);
    $("#people1").html(building5);
    $("#class2").html(building6);
    $("#lang2").html(building7);
    $("#hardware2").html(building8);
    $("#data2").html(building9);
    $("#career2").html(building10);
    $("#people2").html(building11);

    var buttonList = jQuery.makeArray($("#tableContainer table tr .button, .buttonLit"));
    for (var i = 0; i < buttonList.length; i++) {
        buttonList[i].className = canAfford(player.buildings[i]) ? "buttonLit" : "button";
    }
}

/** Game iterate function. */
var iterate = function() {
    if (typeof iterate.count == 'undefined') {
        iterate.count = 0;
    }

    if (typeof iterate.before == 'undefined') {
        iterate.before = new Date();
    }

    var now = new Date();
    var elapsedTime = now.getTime() - iterate.before.getTime();
    iterateAll();
    iterate.before = new Date();
    setTimeout(iterate, player.clockCycleInMilliseconds);
};

/** Game update function. */
var refresh = function() {
    if (typeof refresh.count == 'undefined') {
        refresh.count = 0;
    }

    if (typeof refresh.before == 'undefined') {
        refresh.before = new Date();
    }

    var now = new Date();
    var elapsedTime = now.getTime() - refresh.before.getTime();
    refreshAll();
    refresh.before = new Date();
    setTimeout(refresh, player.refreshIntervalInMilliseconds);
};

/** Runs on startup. */
$(function() {
    console.log("Running start up code.");

    // Initialize player
    init();

    $("#versionNum").html(strings.version);
    $("#moneyButton").click(function(event) {
        moneyButtonClick(player.clickPower);
    });

    iterate();
    refresh();

    if (debug.autosave) {
        setInterval(save, strings.saveIntervalInMilliseconds);
    }
    else {
        console.warn("Autosave is turned off for development purposes.");
    }

    console.log("Finished start up code.");
});