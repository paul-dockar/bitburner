import { disableLogs } from '/utils/scripts.js';
import { getMaxTimeFromBatch, getSumRamFromBatch, isRamAvailable, getServersFromParams, TIME_DELAY_BETWEEN_WORKERS } from '/hack/utils/hack-helper.js';
import { Grow, Weaken } from '/classes/batch.js';
import { getCpuCores } from '/utils/server-info.js';

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);

    let serverList = getServersFromParams(ns);
    await prepareServerList(ns, serverList);
}

/**
 * 
 * @param {NS} ns 
 * @param {array} serverList 
 * @returns 
 */
export async function prepareServerList(ns, serverList) {
    for (let serverObject of serverList) {
        let server = ns.getServer(serverObject.hostname);
        if (!server.purchasedByPlayer && server.moneyAvailable != server.moneyMax) {
            await prepareServer(ns, server);
        }
    }
    return;
}

/**
 * @description 
 * @param {NS} ns 
 * @param {string} server 
 * @returns
 */
async function prepareServer(ns, server) {
    disableLogs(ns);

    if (!ns.fileExists("Formulas.exe")) {
        ns.tprint("Buy Formulas.exe to run this script");
        ns.exit;
    }

    const HOST = ns.getHostname();
    const MAX_RAM = ns.getServerMaxRam(HOST);
    const USED_RAM = ns.getServerUsedRam(HOST);
    const CPU_CORES = getCpuCores(ns, HOST);

    let player = ns.getPlayer();

    let weaken0 = new Weaken(ns, server, player);
    let grow = new Grow(ns, server, player, CPU_CORES);
    let weaken1 = new Weaken(ns, server, player);

    weaken0.setSecurityDifference(server.hackDifficulty);
    weaken0.setWeakenThreads();
    grow.setGrowThreads();
    weaken1.setSecurityDifference(ns.growthAnalyzeSecurity(grow.threads));
    weaken1.setWeakenThreads();

    weaken0.setWeakenTime();
    grow.setGrowTime();
    weaken1.setWeakenTime();

    let maxScriptTime = getMaxTimeFromBatch(weaken0, grow, weaken1);
    weaken0.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 1);
    grow.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 2);
    weaken1.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 3);

    let totalBatchRam = getSumRamFromBatch(weaken0, grow, weaken1);
    if (isRamAvailable(MAX_RAM, USED_RAM, totalBatchRam)) {
        await ns.run(weaken0.filePath, weaken0.threads, server.hostname, weaken0.sleepTime, Math.random(1 * 1e6));
        await ns.run(grow.filePath, grow.threads, server.hostname, grow.sleepTime, Math.random(1 * 1e6));
        await ns.run(weaken1.filePath, weaken1.threads, server.hostname, weaken1.sleepTime, Math.random(1 * 1e6));
    }
    await ns.sleep(TIME_DELAY_BETWEEN_WORKERS);
    return;
}