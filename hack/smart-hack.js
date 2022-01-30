import { disableLogs } from '/utils/scripts.js'
import { weakenServer, growServer, hackServer } from '/hack/utils/hack-helper.js'
import { weakenScriptPath, growthScriptPath, hackScriptPath } from '/hack/utils/file-locations.js'

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

    while (true) {

        await hack();
        await weaken();
        await grow();
        await weaken();
        await ns.sleep(100);
    }

    // let foundMaxTime = false;
    // if (scriptTime > previousScriptTime && !foundMaxTime) {
    //     sleepValue = 1;
    // } else {
    //     maxtime = previousScriptTime;
    //     foundMaxTime = true
    // }

    // if (foundMaxTime) {
    //     maxtime += 1
    //     sleep = maxtime - scriptTime;
    // }

    async function hack(server) {
        server = ns.getServer(target);
        let [waitTime, hackSecurityIncrease, hackTime, pid] = await hackServer(ns, server, player, previousScriptTime, delayTime);
        securityIncrease = hackSecurityIncrease;
        previousScriptTime = hackTime;
        delayTime = waitTime;
        await ns.sleep(1000);
    }

    async function weaken() {
        server = ns.getServer(target);
        let [waitTime, weakenTime, pid] = await weakenServer(ns, server, player, previousScriptTime, delayTime, securityIncrease);
        previousScriptTime = weakenTime;
        delayTime = waitTime;

        return;
    }

    async function grow() {
        server = ns.getServer(target);
        let [waitTime, growSecurityIncrease, growthTime, pid] = await growServer(ns, server, player, delayTime, previousScriptTime);
        securityIncrease = growSecurityIncrease;
        previousScriptTime = growthTime;
        delayTime = waitTime;

        return;
    }
}