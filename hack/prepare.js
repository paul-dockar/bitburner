import { disableLogs } from '/utils/scripts.js';
import { weakenServer, growServer, getServersFromParams } from '/hack/utils/hack-helper.js'
import { weakenScriptPath, growthScriptPath } from '/hack/utils/file-locations.js'

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);

    let serverList = getServersFromParams(ns);
    let runningPids = [];
    runningPids.push(await prepareServerList(ns, serverList));
}

/**
 * 
 * @param {NS} ns 
 * @param {array} serverList 
 * @returns 
 */
export async function prepareServerList(ns, serverList) {
    let runningPids = [];
    for (let serverObject of serverList) {
        let server = ns.getServer(serverObject.hostname);
        if (!server.purchasedByPlayer && !server.moneyMax == 0) {
            runningPids.push(await prepareServer(ns, server));
        }
    }
    return runningPids.filter(Number);
}

/**
 * @description 
 * @param {NS} ns 
 * @param {string} server 
 * @returns
 */
async function prepareServer(ns, server) {
    const HOST = ns.getHostname();

    let player = ns.getPlayer();

    let prepared = false;
    let runningPids = [];
    while (!prepared) {
        server = ns.getServer(server.hostname);

        if (ns.isRunning(weakenScriptPath, HOST, server.hostname) || ns.isRunning(growthScriptPath, HOST, server.hostname)) {
            await ns.sleep(1e4);
            continue;
        }

        let isMinimumSecurity = server.hackDifficulty == server.minDifficulty;
        let isMaxmimumMoney = server.moneyAvailable == server.moneyMax;
        let previousScriptTime = 0;

        if (!isMinimumSecurity) {
            let [weakenTime, pid] = await weakenServer(ns, server, player, previousScriptTime);
            runningPids.push(pid);
            previousScriptTime = weakenTime;
            isMinimumSecurity = true;
        }

        if (!isMaxmimumMoney) {
            let [growthTime, pid] = await growServer(ns, server, player, previousScriptTime);
            previousScriptTime = growthTime;
            runningPids.push(pid);
            isMaxmimumMoney = true;
        }
        prepared = checkServer(isMinimumSecurity, isMaxmimumMoney, prepared);
        await ns.sleep(1);
    }

    return runningPids;
}

/**
 * 
 * @param {boolean} isMinimumSecurity 
 * @param {boolean} isMaxmimumMoney 
 * @param {boolean} prepared 
 * @returns 
 */
function checkServer(isMinimumSecurity, isMaxmimumMoney, prepared) {
    if (isMinimumSecurity && isMaxmimumMoney) {
        prepared = true;
    } else {
        prepared = false;
    }
    return prepared;
}