import { disableLogs } from '/utils/scripts.js';
import { getMaxTimeFromBatch, getSumRamFromBatch, isRamAvailable, getServersFromParams, TIME_DELAY_BETWEEN_WORKERS } from '/hack/utils/hack-helper.js';
import { Grow, Weaken } from '/classes/batch.js';
import { getCpuCores } from '/utils/server-info.js';
//import { weakenScriptPath, growthScriptPath, hackScriptPath } from '/hack/utils/file-locations.js';

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);
    ns.tail();

    let serverList = getServersFromParams(ns);

    let host;
    typeof ns.args[1] != "undefined" ? host = ns.args[1] : host = "home";

    await prepareServerList(ns, serverList, host);
}

/**
 * 
 * @param {NS} ns 
 * @param {array} serverList 
 * @returns 
 */
export async function prepareServerList(ns, serverList, host) {
    for (let serverObject of serverList) {
        let server = ns.getServer(serverObject.hostname);
        if (!server.purchasedByPlayer && server.moneyAvailable != server.moneyMax || server.hackDifficulty != server.minDifficulty) {
            await prepareServer(ns, server, host);
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
export async function prepareServer(ns, server, host) {
    const row = '| %6s | %-25s | %-25s | %-11s |';
    ns.tprintf(row, "SCRIPT", "startDateTime", "finishDateTime", "Result");

    const MAX_RAM = ns.getServerMaxRam(host);
    const USED_RAM = ns.getServerUsedRam(host);
    const CPU_CORES = getCpuCores(ns, host);

    let player = ns.getPlayer();

    let weaken0 = new Weaken(ns, server, player);
    let grow = new Grow(ns, server, player, CPU_CORES);
    let weaken1 = new Weaken(ns, server, player);

    if (ns.fileExists("Formulas.exe", "home")) {
        let serverSecurity = server.hackDifficulty;
        weaken0.setSecurityDifference(serverSecurity);
        weaken0.setWeakenThreads();
        grow.setGrowThreads();
        weaken1.setSecurityDifference(ns.growthAnalyzeSecurity(grow.threads) + serverSecurity);
        weaken1.setWeakenThreads();

        weaken0.setWeakenTime();
        grow.setGrowTime();
        weaken1.setWeakenTime();
    } else {
        //If formulas.exe is not purchased, use inefficient method to calculate threads
        let serverSecurity = server.hackDifficulty - server.minDifficulty;
        weaken0.setSecurityDifference(serverSecurity);
        weaken0.setWeakenThreads();
        grow.setDumbGrowThreads();
        weaken1.setSecurityDifference(ns.growthAnalyzeSecurity(grow.threads) + serverSecurity);
        weaken1.setWeakenThreads();

        weaken0.setDumbWeakenTime();
        grow.setDumbGrowTime();
        weaken1.setDumbWeakenTime();
    }

    let maxScriptTime = getMaxTimeFromBatch(weaken0, grow, weaken1);
    weaken0.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 1);
    grow.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 2);
    weaken1.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 3);

    let totalBatchRam = getSumRamFromBatch(weaken0, grow, weaken1);
    if (isRamAvailable(MAX_RAM, USED_RAM, totalBatchRam)) {
        await ns.exec(weaken0.filePath, host, weaken0.threads, server.hostname, weaken0.sleepTime, Math.random(1 * 1e6));
        await ns.exec(grow.filePath, host, grow.threads, server.hostname, grow.sleepTime, Math.random(1 * 1e6));
        await ns.exec(weaken1.filePath, host, weaken1.threads, server.hostname, weaken1.sleepTime, Math.random(1 * 1e6));
    }
    await ns.sleep(TIME_DELAY_BETWEEN_WORKERS);
    return maxScriptTime;
}