/** @param {NS} ns **/
export async function main(ns) {
    let player = ns.getPlayer();
    let karma = ns.heart.break();
    let peopleKilled = player.numPeopleKilled;

    ns.tprint(`Your Karma is ${karma}`);
    ns.tprint(`You have murdered ${peopleKilled} people`);
}