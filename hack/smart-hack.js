import { treeSearchAlgorithm } from '/hack/tree-search-algorithm.js'
import { find } from '/hack/find.js'
import { prepareServer } from '/hack/prepare.js'

/** @param {NS} ns **/
export async function main(ns) {
    ns.tail();
    //ns.disableLog("sleep");
    //ns.disableLog("getServerMaxMoney");
    if (!ns.fileExists("Formulas.exe")) {
        ns.tprint("Buy Formulas.exe to run this script");
        ns.exit;
    }


    let player = ns.getPlayer();
    let serverList = treeSearchAlgorithm(ns);
    let targetServer = find(ns, serverList);

    for (let server of serverList) {
        //ns.tprint("Name: " + server.hostname + ". Child: " + server.children + ". Parent: " + server.parent);
        let serverInfo = ns.getServer(server.hostname);
        if (!serverInfo.purchasedByPlayer && !serverInfo.moneyMax == 0) {
            await prepareServer(ns, server);
        }
    }
}