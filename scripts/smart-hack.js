import { treeSearchAlgorithm } from '/scripts/tree-search-algorithm.js'
import { find } from '/scripts/find.js'
import { prepareServer } from '/scripts/prepare.js'

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("sleep");
    ns.disableLog("getServerMaxMoney");
    if (!ns.fileExists("Formulas.exe")) {
        ns.tprint("Buy Formulas.exe to run this script");
        ns.exit;
    }


    let player = ns.getPlayer();
    let serverList = treeSearchAlgorithm(ns);
    let targetServer = find(ns, serverList);

    for (let server of serverList) {
        //ns.tprint("Name: " + server.hostname + ". Child: " + server.children + ". Parent: " + server.parent);
        await prepareServer(ns, server);

    }

}