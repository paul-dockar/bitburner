/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    await ns.sleep(100);
    await ns.hack(target);
}