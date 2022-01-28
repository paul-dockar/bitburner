import { treeScan } from '/old/tree-scan.js'

/** @param {NS} ns **/
export async function main(ns) {
    let allTargets = treeScan(ns);
    await removeHack(ns, allTargets);
}

async function removeHack(ns, targets) {
    for (let i = 0; i < targets.length; i++) {
        let file = "hack.js"
        let target = targets[i];

        if (ns.scriptRunning(file, target)) {
            let response = await ns.scriptKill(file, target);
            if (response) ns.tprint("Killed " + file + " on " + target);
            else ns.tprint("fuck you");
        }

        if (ns.fileExists(file, target)) {
            let response = await ns.rm(file, target);
            if (response) ns.tprint("Removed " + file + " from " + target);
            else ns.tprint("fuck you");
        }
    }
}