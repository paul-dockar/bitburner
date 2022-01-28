/** @param {NS} ns **/
export async function main(ns) {
    var target = ns.args[0];
    ns.disableLog("sleep")
    while (true) {
        ns.getServerSecurityLevel(target);
        ns.getServerMinSecurityLevel(target);
        await ns.sleep(100);
        await ns.weaken(target);
    }
}