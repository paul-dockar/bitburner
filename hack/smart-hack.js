import { disableLogs } from '/utils/scripts.js'
import { weakenServer, growServer, hackServer } from '/hack/utils/hack-helper.js'
import { weakenScriptPath, growthScriptPath, hackScriptPath } from '/hack/utils/file-locations.js'
import { getGrowThreads, getWeakenThreads, getHackThreads } from '/hack/utils/hack-helper';
import { isRamAvailable, getCpuCores } from '/utils/server-info.js'
import { Batch, Hack, Grow, Weaken } from '/classes/batch';

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

    let runningPids = [];
    let maxScriptTime = 0;


    while (true) {
        const USED_RAM = ns.getServerUsedRam(HOST);
        const CPU_CORES = getCpuCores(ns, HOST);
        let player = ns.getPlayer();
        let server = ns.getServer(TARGET);
        let securityIncrease = 0;

        let hack = new Hack(ns, server, player);
        let weaken = new Weaken(ns, server, player);
        let grow = new Grow(ns, server, player, CPU_CORES);

        //ns.tprint(JSON.stringify(grow));
        ns.tprint("hackThreads = " + hack.setHackThreads());
        ns.tprint("weakenThreads = " + weaken.setWeakenThreads());
        ns.tprint("growthreads = " + grow.setGrowThreads());

        ns.tprint("hackTime = " + hack.getHackTime());
        ns.tprint("weakenTime = " + weaken.getWeakenTime());
        ns.tprint("growTime = " + grow.getGrowTime());

        await ns.sleep(4000);


        maxScriptTime = getMaxTimeFromBatch(server, player) + 20;
        let paddingTime = 100;

        let totalBatchRam = getMaxRamFromBatch(ns, hack, weaken, grow);
        if (isRamAvailable(MAX_RAM, USED_RAM, totalBatchRam)) {

            // await hack(maxScriptTime);
            // await ns.sleep(paddingTime);

            // await weaken(maxScriptTime);
            // await ns.sleep(paddingTime);

            // await grow(maxScriptTime);
            // await ns.sleep(paddingTime);

            // await weaken(maxScriptTime);
            // await ns.sleep(paddingTime);
        } else {
            await ns.sleep(1e4);
            continue;
        }
    }

    //replace this
    function getMaxTimeFromBatch(server, player) {
        let times = []
        times.push(ns.formulas.hacking.weakenTime(server, player));
        times.push(ns.formulas.hacking.growTime(server, player));
        times.push(ns.formulas.hacking.hackTime(server, player));

        return Math.max(...times);
    }

    async function weaken(maxTime) {
        server = ns.getServer(target);
        await weakenServer(ns, server, player, maxTime, securityIncrease);

        return;
    }

    async function grow(maxTime) {
        server = ns.getServer(target);
        securityIncrease = await growServer(ns, server, player, maxTime);

        return;
    }

    async function hack(maxTime) {
        server = ns.getServer(target);
        securityIncrease = await hackServer(ns, server, player, maxTime);

        return;
    }
}

export let getSecurityIncrease = () => {

}











function getThreadsForBatch(ns, server, player, cpuCores) {
    let hackThreads = getHackThreads(ns, server, player);
    let securityIncrease = ns.hackAnalyzeSecurity(hackThreads);
    let weakenThreads = getWeakenThreads(ns, server, player, securityIncrease);
    let growThreads = getGrowThreads(ns, server, player, cpuCores);
}


function getMaxRamFromBatch(ns, hack, weaken, grow) {
    let maxram = 0;
    maxram += (hack.threads * hack.ram);
    ns.tprint("maxram for batch is = " + maxram);

    let weakenThreadsEstimate = weaken.getWeakenThreads(ns.hackAnalyzeSecurity(hack.threads));
    maxram += (weakenThreadsEstimate * weaken.ram);
    ns.tprint("maxram for batch is = " + maxram);
    maxram += (grow.threads * weaken.ram);
    ns.tprint("maxram for batch is = " + maxram);

    weakenThreadsEstimate = weaken.getWeakenThreads(ns.hackAnalyzeSecurity(hack.threads));
    maxram += (weakenThreadsEstimate * weaken.ram);
    ns.tprint("maxram for batch is = " + maxram);

    return maxram;
}