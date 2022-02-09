/** @param {NS} ns **/
export async function main(ns) {
    let player = ns.getPlayer();
    let karma = ns.heart.break();
    let peopleKilled = player.numPeopleKilled;
    let sharepower = ns.getSharePower();

    ns.tprint(`Your Karma is ${karma}`);
    ns.tprint(`You have murdered ${peopleKilled} people`);
    ns.tprint(`Your faction share power is ${sharepower}`);
}