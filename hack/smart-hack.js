import { disableLogs } from '/utils/scripts.js'
import { weakenServer, growServer, hackServer } from '/hack/utils/hack-helper.js'
import { weakenScriptPath, growthScriptPath, hackScriptPath } from '/hack/utils/file-locations.js'
import { getGrowThreads, getWeakenThreads, getHackThreads } from '/hack/utils/hack-helper';
import { isRamAvailable, getCpuCores } from '/utils/server-info.js'

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);

    if (!ns.fileExists("Formulas.exe")) {
        ns.tprint("Buy Formulas.exe to run this script");
        ns.exit;
    }

    const HOST = ns.getHostname();
    let target = ns.args[0];
    let player = ns.getPlayer();
    let server = ns.getServer(target);

    let runningPids = [];
    let previousScriptTime = 0;
    let delayTime = 0;
    let securityIncrease = 0;
    let maxScriptTime = 0;

    while (true) {
        const MAX_RAM = ns.getServerMaxRam(HOST);
        const USED_RAM = ns.getServerUsedRam(HOST);

        maxScriptTime = getMaxTimeFromBatch(server, player) + 1;
        let paddingTime = 100;

        let totalBatchRam = getMaxRamFromBatch(ns, target);
        if (isRamAvailable(MAX_RAM, USED_RAM, totalBatchRam)) {
            await hack();
            await ns.sleep(paddingTime);
            await weaken();
            await ns.sleep(paddingTime);
            await grow();
            await ns.sleep(paddingTime);
            await weaken();
            await ns.sleep(paddingTime);
        } else {
            ns.sleep(1e4);
        }
    }

    function getMaxTimeFromBatch(server, player) {
        let times = []
        times.push(Math.ceil(ns.formulas.hacking.weakenTime(server, player)));
        times.push(Math.ceil(ns.formulas.hacking.growTime(server, player)));
        times.push(Math.ceil(ns.formulas.hacking.hackTime(server, player)));
        return Math.max(...times);
    }

    async function weaken() {
        server = ns.getServer(target);
        let [pid] = await weakenServer(ns, server, player, maxScriptTime, securityIncrease);

        return;
    }

    async function grow() {
        server = ns.getServer(target);
        let [growSecurityIncrease, pid] = await growServer(ns, server, player, maxScriptTime);
        securityIncrease = growSecurityIncrease;

        return;
    }

    async function hack() {
        server = ns.getServer(target);
        let [hackSecurityIncrease, pid] = await hackServer(ns, server, player, maxScriptTime);
        securityIncrease = hackSecurityIncrease;

        return;
    }
}

function getMaxRamFromBatch(ns, target) {
    const HOST = ns.getHostname();
    const CPU_CORES = getCpuCores(ns, HOST);
    const GROW_RAM = ns.getScriptRam(growthScriptPath);
    const HACK_RAM = ns.getScriptRam(hackScriptPath);
    const WEAKEN_RAM = ns.getScriptRam(weakenScriptPath);
    let player = ns.getPlayer();
    let server = ns.getServer(target);

    let maxram = 0;
    maxram += (getHackThreads(ns, server, player) * HACK_RAM);
    maxram += (getWeakenThreads(ns, server, player) * WEAKEN_RAM);
    maxram += (getGrowThreads(ns, server, player, CPU_CORES) * GROW_RAM);
    return maxram;
}