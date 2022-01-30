/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    var waitTime = ns.args[1];
    await ns.sleep(waitTime);
    let money = await ns.hack(target);

    await ns.tprint("money stolen: " + money);
}