import { disableLogs } from '/utils/scripts.js';
import { find } from '/hack/find.js'
import { prepareServer } from '/hack/prepare.js'
import { processScriptParams } from '/hack/utils/hack-helper.js'

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);

    if (!ns.fileExists("Formulas.exe")) {
        ns.tprint("Buy Formulas.exe to run this script");
        ns.exit;
    }

    let serverList = processScriptParams(ns);
    let sortedServerList = find(ns, serverList);

    for (let serverObject of serverList) {
        let server = ns.getServer(serverObject.hostname);
        if (!server.purchasedByPlayer && !server.moneyMax == 0) {
            await prepareServer(ns, server);
        }
    }
}