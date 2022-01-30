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
            let pids = await prepareServer(ns, server);
            pids.forEach(element => runningPids.push(element));
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
    let isMinimumSecurity = false;
    let isMaxmimumMoney = false;
    let previousScriptTime = 0;
    let delayTime = 0;
    let securityIncrease = 0;
    while (!prepared) {
        server = ns.getServer(server.hostname);

        if (ns.isRunning(weakenScriptPath, HOST, server.hostname) || ns.isRunning(growthScriptPath, HOST, server.hostname)) {
            await ns.sleep(1e4);
            continue;
        }

        isMinimumSecurity = server.hackDifficulty == server.minDifficulty;
        isMaxmimumMoney = server.moneyAvailable == server.moneyMax;
        previousScriptTime = 0;
        securityIncrease = 0;

        await weaken();
        await grow();
        await weaken();

        prepared = checkServer(isMinimumSecurity, isMaxmimumMoney, prepared);
        await ns.sleep(1);
    }

    return runningPids;

    async function weaken() {
        if (!isMinimumSecurity) {
            let [waitTime, weakenTime, pid] = await weakenServer(ns, server, player, previousScriptTime, delayTime, securityIncrease);
            runningPids.push(pid);
            previousScriptTime = weakenTime;
            delayTime = waitTime;
            isMinimumSecurity = true;
        }
        return;
    }

    async function grow() {
        if (!isMaxmimumMoney) {
            let [waitTime, growSecurityIncrease, growthTime, pid] = await growServer(ns, server, player, delayTime, previousScriptTime);
            securityIncrease = growSecurityIncrease;
            previousScriptTime = growthTime;
            delayTime = waitTime;
            runningPids.push(pid);
            isMaxmimumMoney = true;
            isMinimumSecurity = false
        }
        return;
    }
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