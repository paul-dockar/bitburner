import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';

const SCP_FILES = '/private-server/scp-files.js';
const SHARE = '/factions/share-worker.js';

/** @param {NS} ns **/
export async function main(ns) {
    let scpPid = await ns.run(SCP_FILES, 1);
    let scpRunning = true;
    let runningScript;
    while (scpRunning) {
        runningScript = ns.getRunningScript(scpPid);
        runningScript == null ? scpRunning = false : scpRunning = true;
        await ns.sleep(100);
    }

    let serverList = treeSearchAlgorithm(ns);

    let getPrivateServers = (serverList) => {
        let privateServers = [];
        for (let server of serverList) {
            let so = ns.getServer(server.hostname);
            if (so.purchasedByPlayer) {
                privateServers.push(so.hostname);
            }
        }
        return privateServers;
    }

    let privateServerArray = getPrivateServers(serverList);
    while (privateServerArray.length > 1) {
        let host = privateServerArray.pop();
        let privateServer = ns.getServer(host);
        let pserverRam = privateServer.maxRam;
        let scriptRam = ns.getScriptRam(SHARE, host);

        let shareThreads = Math.floor(pserverRam / scriptRam);

        let run = await ns.exec(SHARE, host, shareThreads);
        ns.tprint(`PID = ${run}, started ${SHARE} on ${host}. Threads: ${shareThreads}.`);
        await ns.sleep(1000);
    }
}