import { TreeNode } from '/classes/tree-node.js';

/** @param {NS} ns **/
export async function main(ns) {
    ns.tail();
    let target = new TreeNode(ns.args[0]);
    await prepareServer(ns, target);
}

/**
 * @description 
 * @param {NS} ns 
 * @param {string} server 
 * @returns {boolean} preparing
 */
export async function prepareServer(ns, server) {
    const HOST = ns.getHostname();
    const CPU_CORES = getCpuCores(ns, HOST);
    const HOME = "home";
    const WEAKEN_SLAVE_SCRIPT = "/hack/slave/weaken.js";
    const GROWTH_SLAVE_SCRIPT = "/hack/slave/grow.js";
    const MAX_RAM = ns.getServerMaxRam(HOST);
    const WEAKEN_RAM = ns.getScriptRam(WEAKEN_SLAVE_SCRIPT);
    const GROW_RAM = ns.getScriptRam(GROWTH_SLAVE_SCRIPT);

    let player = ns.getPlayer();
    let serverInfo = ns.getServer(server.hostname);

    let prepared = false;
    while (!prepared) {
        serverInfo = ns.getServer(server.hostname);
        const USED_RAM = ns.getServerUsedRam(HOST);

        if (ns.isRunning(WEAKEN_SLAVE_SCRIPT, HOST, server.hostname) || ns.isRunning(GROWTH_SLAVE_SCRIPT, HOST, server.hostname)) {
            await ns.sleep(1e4);
            continue;
        }

        let isMinimumSecurity = serverInfo.hackDifficulty == serverInfo.minDifficulty;
        let isMaxmimumMoney = serverInfo.moneyAvailable == serverInfo.moneyMax;
        let weakenTime = 0;
        let growthTime = 0;

        if (!isMinimumSecurity) {
            let weakenThreads = getWeakenThreads(ns, serverInfo, CPU_CORES);
            weakenTime = Math.round(ns.formulas.hacking.weakenTime(serverInfo, player));

            if (isRamAvailable(weakenThreads, MAX_RAM, USED_RAM, WEAKEN_RAM)) {
                let pid = ns.exec(WEAKEN_SLAVE_SCRIPT, HOST, weakenThreads, serverInfo.hostname, 0);
            } else {
                await ns.sleep(1e4);
            }
            isMinimumSecurity = true;
        }
        if (!isMaxmimumMoney) {
            let growthThreads = getGrowThreads(ns, serverInfo, player, CPU_CORES);
            growthTime = Math.round(ns.formulas.hacking.growTime(serverInfo, player));
            let waitTime = Math.ceil(getWaitTime(weakenTime, growthTime));

            if (isRamAvailable(growthThreads, MAX_RAM, USED_RAM, GROW_RAM)) {
                let pid = ns.exec(GROWTH_SLAVE_SCRIPT, HOST, growthThreads, serverInfo.hostname, waitTime);
            } else {
                await ns.sleep(1e4);
            }
            isMaxmimumMoney = true;
        }

        if (isMinimumSecurity && isMaxmimumMoney) {
            prepared = true;
            ns.print("Server : " + serverInfo.hostname + " has been prepared.");
        }
        await ns.sleep(1);
    }
    return prepared;
}

/** 
 * @description 
 * @param  {NS} ns
 * @param  {Node} server
 * @param  {number} cores
 * @returns {number} weakenThreads
 */
function getWeakenThreads(ns, server, cores) {
    let weakenThreads = 1;
    let securityDifference;
    let securityDecrease;
    do {
        securityDifference = server.hackDifficulty - server.minDifficulty
        securityDecrease = ns.weakenAnalyze(weakenThreads, cores);
        weakenThreads += 1;
    } while (securityDifference > securityDecrease);
    return weakenThreads;
}

/** 
 * @description 
 * @param  {NS} ns
 * @param  {Node} server
 * @param  {number} cores
 * @returns {number} growthThreads
 */
function getGrowThreads(ns, server, player, cores) {
    let estimatedGrowthMultiplier = Math.ceil(server.moneyMax / (server.moneyAvailable + 1));

    let growthThreads = 1;
    let growthPercent;
    do {
        growthPercent = ns.formulas.hacking.growPercent(server, growthThreads, player, cores);
        growthThreads += 1;
    } while (estimatedGrowthMultiplier > growthPercent / 100);
    return growthThreads;

}

/**
 * @description 
 * @param {number} a 
 * @param {number} b 
 * @returns {number} waitTime
 */
function getWaitTime(a, b) {
    let waitTime;
    if (a < b) waitTime = 1;
    else waitTime = a - b;
    return waitTime + 20;
}

/**
 * @description Returns true if there is enough RAM available on current server to exec script with the required threads
 * @param {number} threads 
 * @param {number} maxRam 
 * @param {number} usedRam 
 * @returns {boolean}
 */
function isRamAvailable(threads, maxRam, usedRam, scriptRam) {
    return threads * scriptRam < maxRam - usedRam;
}

/** 
 * @description Returns how many cpu cores are on player owned servers
 * @param  {NS} ns
 * @param  {string} host
 * @returns {number} cores
 */
function getCpuCores(ns, host) {
    let server = ns.getServer(host);
    let cores = 1;
    if (server.purchasedByPlayer) {
        cores = server.cpuCores;
    }
    return cores;
}