import { disableLogs } from '/utils/scripts.js'
import { find } from '/hack/find.js'
import { prepareServerList } from '/hack/prepare.js'
import { getServersFromParams } from '/hack/utils/hack-helper.js'
import { weakenScriptPath, growthScriptPath } from '/hack/utils/file-locations.js'

/** @param {NS} ns **/
export async function main(ns) {
    disableLogs(ns);

    if (!ns.fileExists("Formulas.exe")) {
        ns.tprint("Buy Formulas.exe to run this script");
        ns.exit;
    }

    const HOST = ns.getHostname();

    let serverList = getServersFromParams(ns);

    let runningPids = [];
    runningPids.push(await prepareServerList(ns, serverList));


    ns.tprint("runningPids = " + runningPids);

    // Wait for preparing scripts to finish
    let isRunning = runningPids => {
        for (let pid of runningPids) {
            if (ns.isRunning(pid), HOST) {
                ns.sleep(1e4)
                ns.tprint("waiting for " + pid + " to finish");
                isRunning(runningPids);
            }
        }
    }

    let sortedServerList = find(ns, serverList);



    function newFunction() {

    }
}