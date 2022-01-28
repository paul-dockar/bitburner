import { TreeNode } from '/classes/tree-node.js';

/** @param {NS} ns **/
export async function main(ns) {
    let target = new TreeNode(ns.args[0]);
    await prepareServer(ns, target);
}
/** 
 * @param  {NS} ns
 * @param  {string} server
 */
export async function prepareServer(ns, server) {
    const CPU_CORES = getCpuCores(ns, "home");
    const HOME = "home";
    const WEAKEN_SLAVE_SCRIPT = "/scripts/slave/weaken.js";
    const GROWTH_SLAVE_SCRIPT = "/scripts/slave/grow.js";


    let player = ns.getPlayer();
    let serverInfo = ns.getServer(server.hostname);
    if (serverInfo.purchasedByPlayer || serverInfo.moneyMax == 0) {
        return;
    }

    let preparing = true;
    while (preparing) {
        serverInfo = ns.getServer(server.hostname);

        let isWeak = serverInfo.hackDifficulty == serverInfo.minDifficulty;
        let isGrown = serverInfo.moneyAvailable == serverInfo.moneyMax;
        let weakenTime = 0;
        let growthTime = 0;

        if (!isWeak) {
            let weakenThreads = getWeakenThreads(ns, serverInfo, CPU_CORES);
            weakenTime = Math.round(ns.formulas.hacking.weakenTime(serverInfo, player));
            let pid = ns.exec(WEAKEN_SLAVE_SCRIPT, HOME, weakenThreads, server.hostname, 0);
        }
        if (!isGrown) {
            let growthThreads = getGrowThreads(ns, serverInfo, player, CPU_CORES);
            growthTime = Math.round(ns.formulas.hacking.growTime(serverInfo, player));
            let waitTime = Math.ceil(getWaitTime(weakenTime, growthTime));
            let pid = ns.exec(GROWTH_SLAVE_SCRIPT, HOME, growthThreads, server.hostname, waitTime);
            isWeak = true;
        }

        if (isWeak && isGrown) {
            preparing = false;
        }
        await ns.sleep(1);
    }
}

/** 
 * @param  {NS} ns
 * @param  {Node} server
 * @param  {number} cores
 * @return {number} weakenThreads
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
 * @param  {NS} ns
 * @param  {Node} server
 * @param  {number} cores
 * @return {number} growthThreads
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

function getWaitTime(weakTime, growthTime) {
    let waitTime;
    if (weakTime < growthTime) waitTime = 1;
    else waitTime = weakTime - growthTime;
    return waitTime + 20;
}

/** 
 * @param  {NS} ns
 * @param  {string} host
 * @return {number} cores
 */
function getCpuCores(ns, host) {
    let server = ns.getServer(host);
    let cores = server.cpuCores;
    return cores;
}