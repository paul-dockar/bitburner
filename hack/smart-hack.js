import { disableLogs } from '/utils/scripts.js';
import { getMaxTimeFromBatch, getMaxRamFromBatch, isRamAvailable } from '/hack/utils/hack-helper.js';
import { Hack, Grow, Weaken } from '/classes/batch.js';
import { getCpuCores } from '/utils/server-info.js';

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);

    if (!ns.fileExists("Formulas.exe")) {
        ns.tprint("Buy Formulas.exe to run this script");
        ns.exit;
    }

    const HOST = ns.getHostname();
    const MAX_RAM = ns.getServerMaxRam(HOST);
    const TARGET = ns.args[0];

    while (true) {
        const USED_RAM = ns.getServerUsedRam(HOST);
        const CPU_CORES = getCpuCores(ns, HOST);
        let player = ns.getPlayer();
        let server = ns.getServer(TARGET);

        let hack = new Hack(ns, server, player);
        let weaken0 = new Weaken(ns, server, player);
        let grow = new Grow(ns, server, player, CPU_CORES);
        let weaken1 = new Weaken(ns, server, player);

        //ns.tprint(JSON.stringify(grow));
        hack.setHackThreads();
        weaken0.setSecurityDifference(ns.hackAnalyzeSecurity(hack.threads));
        weaken0.setWeakenThreads();
        grow.setGrowThreads();
        weaken1.setSecurityDifference(ns.growthAnalyzeSecurity(grow.threads));
        weaken1.setWeakenThreads();

        hack.setHackTime();
        weaken0.setWeakenTime();
        grow.setGrowTime();
        weaken1.setWeakenTime();

        let maxScriptTime = getMaxTimeFromBatch(hack, weaken0, grow, weaken1);
        hack.setSleepTime(maxScriptTime);
        weaken0.setSleepTime(maxScriptTime);
        grow.setSleepTime(maxScriptTime);
        weaken1.setSleepTime(maxScriptTime);

        let totalBatchRam = getMaxRamFromBatch(hack, weaken0, grow, weaken1);
        if (isRamAvailable(MAX_RAM, USED_RAM, totalBatchRam)) {
            let delay = 100;

            await ns.run(hack.filePath, hack.threads, server.hostname, hack.sleepTime, Math.random(1 * 1e6));
            await ns.sleep(delay);

            await ns.run(weaken0.filePath, weaken0.threads, server.hostname, weaken0.sleepTime, Math.random(1 * 1e6));
            await ns.sleep(delay);

            await ns.run(grow.filePath, grow.threads, server.hostname, grow.sleepTime, Math.random(1 * 1e6));
            await ns.sleep(delay);

            await ns.run(weaken1.filePath, weaken1.threads, server.hostname, weaken1.sleepTime, Math.random(1 * 1e6));
            await ns.sleep(delay);

        } else {
            await ns.sleep(1e4);
            continue;
        }
    }
}