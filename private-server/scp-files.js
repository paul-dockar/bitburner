import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';

const weakenScriptPath = "/hack/worker/weaken.js";
const growthScriptPath = "/hack/worker/grow.js";
const hackScriptPath = "/hack/worker/hack.js";
const shareScriptPath = "/factions/share-worker.js";

/** @param {NS} ns **/
export async function main(ns) {
    let serverList = treeSearchAlgorithm(ns);
    await scpTransfer(ns, serverList);
}


/**
 * @param {NS} ns
 * @param {Array<Object>} serverList
 */
async function scpTransfer(ns, serverList) {
    let files = [];
    files.push(weakenScriptPath);
    files.push(growthScriptPath);
    files.push(hackScriptPath);
    files.push(shareScriptPath);

    for (let server of serverList) {
        for (let file of files) {

            let so = ns.getServer(server.hostname);
            if (so.purchasedByPlayer && so.hostname != "home") {
                let response = await ns.scp(file, "home", server.hostname);
                await ns.sleep(40);

                if (response) ns.tprint(`Successfully copied ${file} onto ${server.hostname}`);
                else ns.tprint(`Failed to copy ${file} onto ${server.hostname}`);
            }
        }
    }
}