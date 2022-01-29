import { isRamAvailable, getCpuCores } from '/utils/server-info.js'
import { disableLogs } from '/utils/scripts.js';
import { weakenServer, growServer, processScriptParams, getWeakenInfo, getGrowthInfo, getWaitTime } from '/hack/utils/hack-helper.js'

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);

    let serverList = processScriptParams(ns);

    for (let serverObject of serverList) {
        let server = ns.getServer(serverObject.hostname);
        if (!server.purchasedByPlayer && !server.moneyMax == 0) {
            await prepareServer(ns, server);
        }
    }
}

/**
 * @description 
 * @param {NS} ns 
 * @param {string} server 
 * @returns {boolean} preparing
 */
export async function prepareServer(ns, server) {
    const HOST = ns.getHostname();
    const WEAKEN_SLAVE_SCRIPT = "/hack/worker/weaken.js";
    const GROWTH_SLAVE_SCRIPT = "/hack/worker/grow.js";

    let player = ns.getPlayer();

    let prepared = false;
    while (!prepared) {
        server = ns.getServer(server.hostname);

        if (ns.isRunning(WEAKEN_SLAVE_SCRIPT, HOST, server.hostname) || ns.isRunning(GROWTH_SLAVE_SCRIPT, HOST, server.hostname)) {
            await ns.sleep(1e4);
            continue;
        }

        let isMinimumSecurity = server.hackDifficulty == server.minDifficulty;
        let isMaxmimumMoney = server.moneyAvailable == server.moneyMax;
        let weakenTime = 0;
        let growthTime = 0;

        [isMinimumSecurity, weakenTime] = await weakenServer(isMinimumSecurity, weakenTime, ns, server, player, HOST, WEAKEN_SLAVE_SCRIPT);
        [isMaxmimumMoney, growthTime] = await growServer(isMaxmimumMoney, growthTime, ns, server, player, weakenTime, HOST, GROWTH_SLAVE_SCRIPT);

        if (isMinimumSecurity && isMaxmimumMoney) {
            prepared = true;
            //ns.print("Server : " + server.hostname + " has been prepared.");
        }
        await ns.sleep(1);
    }
    return prepared;
}