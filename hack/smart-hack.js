import { disableLogs } from '/utils/scripts.js';
import { getMaxTimeFromBatch, getSumRamFromBatch, isRamAvailable, TIME_DELAY_BETWEEN_WORKERS, TIME_DELAY_BETWEEN_BATCHES } from '/hack/utils/hack-helper.js';
import { Hack, Grow, Weaken } from '/classes/batch.js';
import { getCpuCores } from '/utils/server-info.js';
import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';
import { findNextServer } from '/hack/find.js';

/** @param {NS} ns **/
export async function main(ns) {
    let enableTail = await ns.prompt("Tail log?");
    if (enableTail) ns.tail();

    let serverList = treeSearchAlgorithm(ns);
    let runningTargets = [];
    let target = findNextServer(ns, serverList, runningTargets);

    let player = ns.getPlayer();
    let server = ns.getServer(ns.args[0]);

    //Decide logging style based on args on startup
    let logging = loggingStyle(ns);
    if (logging) {
        const row = '| %6s | %-25s | %-25s | %-11s |';
        ns.tprintf(row, "SCRIPT", "startDateTime", "finishDateTime", "Result");
    }

    //await ns.sleep(10000);

    let isServerPrepared = (server) => {
        if (server.moneyAvailable != server.moneyMax) return false;
        if (server.hackDifficulty != server.minDifficulty) return false;
        return true;
    }

    if (!isServerPrepared(server)) {
        ns.tprint(`Server ${server.hostname} must be prepared beforehand. Aborting script`);
        ns.exit();
    }

    let allRunningBatchFinishTimes = [];
    while (true) {
        const HOST = ns.getHostname();
        const MAX_RAM = ns.getServerMaxRam(HOST);
        const CPU_CORES = getCpuCores(ns, HOST);

        server = ns.getServer(ns.args[0]);
        player = ns.getPlayer();

        let hack = new Hack(ns, server, player);
        let weaken0 = new Weaken(ns, server, player);
        let grow = new Grow(ns, server, player, CPU_CORES);
        let weaken1 = new Weaken(ns, server, player);

        //TODO:
        //Use Formula.exe if available, else calculate (inefficently) the script time and threads
        if (ns.fileExists("Formulas.exe")) {
            //Set the threads for each script in the batch
            hack.setHackThreads();
            let serverSecurity = server.hackDifficulty - server.minDifficulty;
            weaken0.setSecurityDifference(ns.hackAnalyzeSecurity(hack.threads) + serverSecurity);
            weaken0.setWeakenThreads();
            grow.setGrowThreads();
            weaken1.setSecurityDifference(ns.growthAnalyzeSecurity(grow.threads) + serverSecurity);
            weaken1.setWeakenThreads();

            //Set the runtime of each script in the batch
            hack.setHackTime();
            weaken0.setWeakenTime();
            grow.setGrowTime();
            weaken1.setWeakenTime();
        } else {
            ns.tprint("buy formulas.exe idiot");
            ns.exit();
        }

        //Set the delay time of each script in the batch to ensure they all finish 50ms after eachother
        let maxScriptTime = getMaxTimeFromBatch(hack, weaken0, grow, weaken1);
        hack.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 1);
        weaken0.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 2);
        grow.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 3);
        weaken1.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 4);

        //Set the dateTime at which the worker scripts will execute their hack/grow/weaken
        let currentTime = Date.now();
        hack.setExecDateTime(currentTime);
        weaken0.setExecDateTime(currentTime);
        grow.setExecDateTime(currentTime);
        weaken1.setExecDateTime(currentTime);

        /**
         * @description - checks if previous batch scripts are close to finishing.
         * @returns - false if previous batches will impact current batch execution
         */
        let isSafeToStartBatch = () => {
            batchEarliestFinishTime = currentTime + hack.scriptTime + hack.sleepTime - TIME_DELAY_BETWEEN_WORKERS;

            if (allRunningBatchFinishTimes.length === 0) {
                return true;
            }

            let isSafe = true;
            for (let finishTime of allRunningBatchFinishTimes) {
                if (currentTime > finishTime) {
                    let index = allRunningBatchFinishTimes.indexOf(finishTime, 0);
                    allRunningBatchFinishTimes.splice(index, 1);
                }
                if (hack.executionDateTime > finishTime) isSafe = false;
                if (weaken0.executionDateTime > finishTime) isSafe = false;
                if (grow.executionDateTime > finishTime) isSafe = false;
                if (weaken1.executionDateTime > finishTime) isSafe = false;
            }
            return isSafe;
        }

        let batchEarliestFinishTime;
        if (isSafeToStartBatch()) {
            //Calculate the total ram required to run the batch, delay if ram is not enough and try again.
            const USED_RAM = ns.getServerUsedRam(HOST);
            let totalBatchRam = getSumRamFromBatch(hack, weaken0, grow, weaken1);
            if (isRamAvailable(MAX_RAM, USED_RAM, totalBatchRam)) {
                allRunningBatchFinishTimes.push(batchEarliestFinishTime);

                await ns.run(hack.filePath, hack.threads, server.hostname, hack.sleepTime, logging, Math.random(1 * 1e6));
                await ns.run(weaken0.filePath, weaken0.threads, server.hostname, weaken0.sleepTime, logging, Math.random(1 * 1e6));
                await ns.run(grow.filePath, grow.threads, server.hostname, grow.sleepTime, logging, Math.random(1 * 1e6));
                await ns.run(weaken1.filePath, weaken1.threads, server.hostname, weaken1.sleepTime, logging, Math.random(1 * 1e6));

            } else {
                //@TODO: if out of ram on home machine, shoot off to privServer slave controller
                ns.print("waiting on more ram plz download some");
                await ns.sleep(TIME_DELAY_BETWEEN_BATCHES * 20);
                continue;
            }
        } else {
            //@TODO: if not safe, start hacking the next best target
            await ns.sleep(TIME_DELAY_BETWEEN_BATCHES);
            continue;
        }
        await ns.sleep(TIME_DELAY_BETWEEN_BATCHES);
    }
}

function loggingStyle(ns) {
    let loggingArg;
    let logging = false;

    if (typeof ns.args[1] != "undefined") loggingArg = ns.args[1];

    switch (loggingArg) {
        case 'workers':
            disableLogs(ns);
            logging = true;
            break;
        case 'full':
            logging = true;
            break;
        default:
            disableLogs(ns);
            logging = false;
            break;
    }
    return logging;
}