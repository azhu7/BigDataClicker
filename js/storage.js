/**
 * Author: Alexander Zhu
 * Date Created: March 15, 2018
 * Description: Storage functions for Big Data Clicker.
 */

/** Save player state to local storage. */
function save() {
	localStorage.setItem(strings.savedPlayer, JSON.stringify(player));
}

/**
 * Turn Objects back to their respective classes as converting to/from JSON
 * loses class identity.
 */
function fixLoadedObjects() {
	for (var i = 0; i < player.buildings.length; i++) {
		player.buildings[i] = new Building(
			player.buildings[i].costFactor,
			player.buildings[i].cost,
			player.buildings[i].costType,
			player.buildings[i].revenue,
			player.buildings[i].revenueType,
			player.buildings[i].owned,
			player.buildings[i].manual);
	}
}

/** Load player state from local storage. */
function load() {
	$.extend(true, player, JSON.parse(localStorage.getItem(strings.savedPlayer)));
	fixLoadedObjects();
}

/** Wipe player state from local storage. */
function wipe() {
    var confirmation = confirm("Are you sure you want to permanently erase your savefile?");
    if (confirmation === true) {
        init();
        localStorage.setItem(strings.savedPlayer, JSON.stringify(player));
        updateAll();
    }
}