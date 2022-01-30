/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    var waitTime = ns.args[1];
    await ns.sleep(waitTime);
    await ns.grow(target);


    ns.tprint("GROW");
}