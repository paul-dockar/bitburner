import { disableLogs } from '/utils/scripts.js';
import { getMaxTimeFromBatch, getSumRamFromBatch, isRamAvailable } from '/hack/utils/hack-helper.js';
import { Hack, Grow, Weaken } from '/classes/batch.js';
import { getCpuCores } from '/utils/server-info.js';
import { TIME_DELAY_BETWEEN_WORKERS, TIME_DELAY_BETWEEN_BATCHES } from '/hack/utils/hack-helper';

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);

    if (!ns.fileExists("Formulas.exe")) {
        ns.tprint("Buy Formulas.exe to run this script");
        ns.exit;
    }

    const HOST = ns.getHostname();
    const MAX_RAM = ns.getServerMaxRam(HOST);
    const CPU_CORES = getCpuCores(ns, HOST);

    let server = ns.getServer(ns.args[0]);
    let player = ns.getPlayer();

    let isServerPrepared = (server) => {
        if (server.moneyAvailable != server.moneyMax) return false;
        if (server.hackDifficulty != server.minDifficulty) return false;
        return true;
    }

    if (!isServerPrepared(server)) {
        ns.tprint(`Server ${server.hostname} must be prepared beforehand. Aborting script`);
        ns.exit();
    }

    let minimumHackTime = ns.formulas.hacking.hackTime(server, player);
    let minimumWeakenTime = ns.formulas.hacking.weakenTime(server, player);
    let minimumGrowTime = ns.formulas.hacking.growTime(server, player);

    let i = 0;
    while (true) {
        server = ns.getServer(ns.args[0]);
        player = ns.getPlayer();

        let hack = new Hack(ns, server, player);
        let weaken0 = new Weaken(ns, server, player);
        let grow = new Grow(ns, server, player, CPU_CORES);
        let weaken1 = new Weaken(ns, server, player);

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

        //Set the delay time of each script in the batch to ensure they all finish 50ms after eachother
        let maxScriptTime = getMaxTimeFromBatch(hack, weaken0, grow, weaken1);
        hack.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 1);
        weaken0.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 2);
        grow.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 3);
        weaken1.setSleepTime(maxScriptTime, TIME_DELAY_BETWEEN_WORKERS * 4);

        let isSafeToStartBatch = () => {
            //todo: add code to prevent starting a batch whilst an earlier batch is finishing


            return;
            // let hackTimeCheck = hack.scriptTime <= minimumHackTime;
            // let weaken0TimeCheck = weaken0.scriptTime <= minimumWeakenTime;
            // let growTimeCheck = grow.scriptTime <= minimumGrowTime;
            // let weaken1TimeCheck = weaken1.scriptTime <= minimumWeakenTime;

            // return hackTimeCheck && weaken0TimeCheck && growTimeCheck && weaken1TimeCheck;
        }

        if (isSafeToStartBatch()) {
            //Calculate the total ram required to run the batch, delay if ram is not enough and try again.
            const USED_RAM = ns.getServerUsedRam(HOST);
            let totalBatchRam = getSumRamFromBatch(hack, weaken0, grow, weaken1);
            if (isRamAvailable(MAX_RAM, USED_RAM, totalBatchRam)) {
                const row = '%6s | %-26s | %-26s | %6s | %8s | %12s | %16s | %16s | %16s | %10s';
                ns.tprintf(row, '------', '------', '------', '------', '------', '------', '------', '------', '------', '------');
                ns.tprintf(row, 'name', 'startTime', 'finishTime', 'lag', 'waitTime', 'money hacked', 'estScriptTime', 'actualScriptTime', 'maxScriptTime', 'order');
                await ns.run(hack.filePath, hack.threads, server.hostname, hack.sleepTime, hack.scriptTime, maxScriptTime, i, Math.random(1 * 1e6));
                i++;

                await ns.run(weaken0.filePath, weaken0.threads, server.hostname, weaken0.sleepTime, weaken0.scriptTime, maxScriptTime, i, Math.random(1 * 1e6));
                i++;

                await ns.run(grow.filePath, grow.threads, server.hostname, grow.sleepTime, grow.scriptTime, maxScriptTime, i, Math.random(1 * 1e6));
                i++;

                await ns.run(weaken1.filePath, weaken1.threads, server.hostname, weaken1.sleepTime, weaken1.scriptTime, maxScriptTime, i, Math.random(1 * 1e6));
                i++;

            } else {
                ns.print("waiting on more ram plz download some");
                await ns.sleep(TIME_DELAY_BETWEEN_BATCHES * 20);
                continue;
            }
        } else {
            ns.print("batch safety protection enabled, sleep a little. This shouldnt occur unless timings are too tight + lag");
            await ns.sleep(TIME_DELAY_BETWEEN_BATCHES * 20);
            continue;
        }
        await ns.sleep(TIME_DELAY_BETWEEN_BATCHES);
    }
}