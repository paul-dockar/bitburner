import { TreeNode } from '/classes/tree-node.js'
import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js'
import { isRamAvailable, getCpuCores } from '/utils/server-info.js'

/**
 * 
 * @param {boolean} isMinimumSecurity 
 * @param {number} weakenTime 
 * @param {NS} ns 
 * @param {Server} server 
 * @param {Player} player 
 * @param {string} host 
 * @param {string} weakenSlaveScript 
 * @returns 
 */
export async function weakenServer(isMinimumSecurity, weakenTime, ns, server, player, host, weakenSlaveScript) {
    const WEAKEN_RAM = ns.getScriptRam(weakenSlaveScript);
    const MAX_RAM = ns.getServerMaxRam(host);
    const USED_RAM = ns.getServerUsedRam(host);

    if (!isMinimumSecurity) {
        let weakenThreads;
        ({ weakenThreads, weakenTime } = getWeakenInfo(ns, server, weakenTime, player));

        if (isRamAvailable(weakenThreads, MAX_RAM, USED_RAM, WEAKEN_RAM)) {
            let pid = ns.exec(weakenSlaveScript, host, weakenThreads, server.hostname, 0);
        } else {
            await ns.sleep(1e4);
        }
        isMinimumSecurity = true;
    }
    return [isMinimumSecurity, weakenTime];
}

/**
 * 
 * @param {boolean} isMaxmimumMoney 
 * @param {number} growthTime 
 * @param {NS} ns 
 * @param {Server} server 
 * @param {Player} player 
 * @param {number} weakenTime 
 * @param {string} host 
 * @param {string} growthSlaveScript 
 * @returns 
 */
export async function growServer(isMaxmimumMoney, growthTime, ns, server, player, weakenTime, host, growthSlaveScript) {
    const CPU_CORES = getCpuCores(ns, host);
    const GROW_RAM = ns.getScriptRam(growthSlaveScript);
    const MAX_RAM = ns.getServerMaxRam(host);
    const USED_RAM = ns.getServerUsedRam(host);

    if (!isMaxmimumMoney) {
        let growthThreads;
        ({ growthThreads, growthTime } = getGrowthInfo(ns, server, player, CPU_CORES, growthTime));

        let waitTime = Math.ceil(getWaitTime(weakenTime, growthTime));

        if (isRamAvailable(growthThreads, MAX_RAM, USED_RAM, GROW_RAM)) {
            let pid = ns.exec(growthSlaveScript, host, growthThreads, server.hostname, waitTime);
        } else {
            await ns.sleep(1e4);
        }
        isMaxmimumMoney = true;
    }
    return [isMaxmimumMoney, growthTime];
}

/**
 * 
 * @param {NS} ns 
 * @returns {array}
 */
export function processScriptParams(ns) {
    let arg = ns.args[0];
    if (arg == null) {
        ns.tprint("Please include argument; server.hostname or 'all'");
        ns.exit();
    }

    let serverList = [];

    if (arg == "all") {
        serverList = treeSearchAlgorithm(ns);
    } else {
        let server = new TreeNode(arg);
        serverList.push(server);
    }
    return serverList;
}

/** 
 * @description 
 * @param  {NS} ns
 * @param  {Node} server
 * @param  {number} cores
 * @returns {number}
 */
export function getWeakenThreads(ns, server, cores) {
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
 * 
 * @param {NS*} ns 
 * @param {Server} server 
 * @param {number} CPU_CORES 
 * @param {number} weakenTime 
 * @param {Player} player 
 * @returns {array}
 */
export function getWeakenInfo(ns, server, weakenTime, player) {
    const CPU_CORES = getCpuCores(ns);

    let weakenThreads = getWeakenThreads(ns, server, CPU_CORES);
    weakenTime = Math.round(ns.formulas.hacking.weakenTime(server, player));
    return { weakenThreads, weakenTime };
}

/** 
 * @description 
 * @param  {NS} ns
 * @param  {Node} server
 * @param  {number} cores
 * @returns {number}
 */
export function getGrowThreads(ns, server, player, cores) {
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
 * 
 * @param {NS} ns 
 * @param {Server} server 
 * @param {Player} player 
 * @param {number} CPU_CORES 
 * @param {number} growthTime 
 * @returns {array}
 */
export function getGrowthInfo(ns, server, player, CPU_CORES, growthTime) {
    let growthThreads = getGrowThreads(ns, server, player, CPU_CORES);
    growthTime = Math.round(ns.formulas.hacking.growTime(server, player));
    return { growthThreads, growthTime };
}

/**
 * @description 
 * @param {number} a 
 * @param {number} b 
 * @returns {number}
 */
export function getWaitTime(a, b) {
    let waitTime;
    if (a < b) waitTime = 1;
    else waitTime = a - b;
    return waitTime + 20;
}