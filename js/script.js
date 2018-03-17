var player = {};

/* -- Helper functions -- */

/** Default initialize player. */
function init() {
    player = new Player();
}

/** Format number for displaying.
 * @param  {number} num - Number to display.
 * @param  {string} prefix - Prefix of number.
 * @param  {string} suffix - Suffix of number.
 * @return {string} Formatted number.
 */
function showNum(num, {prefix= "", suffix= ""} = {}) {
    return `${prefix}${num.toFixed(2)} ${suffix}`;
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
    iterateResources();
}

/** Iterate all resources (money, buildings, etc). */
function iterateResources() {
    var rowLen = player.numBuildingTypes;
    for (var i = 0; i < rowLen; i++) {
        // Generate lower tier buildings from higher tiers
        for (var j = player.highestUnlockedTier - 1; j > 0; j--) {
            player.buildings[i + (j-1)*rowLen].owned += player.buildings[i + j*rowLen].payout();
        }

        // Compute currency from first tier buildings
        addCurrency(player.buildings[i].revenueType, player.buildings[i].payout());
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
		moneyPerSecond: showNum(player.moneyPerSecond),
		netMoneyPerSecond: showNum(player.netMoneyPerSecond),
		moneyPerClick: showNum(player.moneyPerClick),
		moneyPerAutoclick: showNum(player.moneyPerAutoclick),
		data: showNum(player.data),
		dataPerSecond: showNum(player.dataPerSecond),
		netDataPerSecond: showNum(player.netDataPerSecond),
		programs: showNum(player.programs),
		programsPerSecond: showNum(player.programsPerSecond),
		clockCycleInMilliseconds: showNum(player.clockCycleInMilliseconds),
	});

	$("#info").html(newDataTable);
}

/** Refresh html inventory. */
function refreshInventory() {
    var buildingInfoTemplate = _.template($("#buildingInfoTemplate").html());

    var building0 = buildingInfoTemplate({
        name: "Intro to CS",
        revenue: showNum(player.buildings[0].revenue, {prefix: "$"}),
        cost: showNum(player.buildings[0].cost, {prefix: "$"}),
        owned: showNum(player.buildings[0].owned),
        manual: showNum(player.buildings[0].manual)
    });

    var building1 = buildingInfoTemplate({
        name: "Assembly",
        revenue: showNum(player.buildings[1].revenue, {suffix: "programs"}),
        cost: showNum(player.buildings[1].cost, {prefix: "$"}),
        owned: showNum(player.buildings[1].owned),
        manual: showNum(player.buildings[1].manual)
    });

    var building2 = buildingInfoTemplate({
        name: "Data Structures",
        revenue: showNum(player.buildings[2].revenue, {suffix: "Intro to CS"}),
        cost: showNum(player.buildings[2].cost, {prefix: "$"}),
        owned: showNum(player.buildings[2].owned),
        manual: showNum(player.buildings[2].manual)
    });

    var building3 = buildingInfoTemplate({
        name: "C",
        revenue: showNum(player.buildings[3].revenue, {suffix: "Assembly"}),
        cost: showNum(player.buildings[3].cost, {prefix: "$"}),
        owned: showNum(player.buildings[3].owned),
        manual: showNum(player.buildings[3].manual)
    });

    $("#class1").html(building0);
    $("#lang1").html(building1);
    $("#class2").html(building2);
    $("#lang2").html(building3);

    var buttonList = jQuery.makeArray($("#tableContainer table tr .button,.buttonLit"));
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
    if (localStorage.getItem(strings.savedPlayer)) {
        console.log("Found saved file. Loading.");
        init();//load();
    }
    else {
        init();
    }

    $("#versionNum").html(strings.version);
    $("#moneyButton").click(function(event) {
        moneyButtonClick(player.clickPower);
    });

    iterate();
    refresh();
    setInterval(save, strings.saveIntervalInMilliseconds);

    console.log("Finished start up code.");
});