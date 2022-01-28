/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    ns.disableLog("sleep")
    while (true) {
        ns.getServerMoneyAvailable(target);
        ns.getServerMaxMoney(target);
        ns.getServerSecurityLevel(target);
        await ns.sleep(100);
        await ns.hack(target);
    }
}