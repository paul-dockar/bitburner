import { find } from '/find-hack-target.js'
import { treeScan } from '/tree-scan.js'

/** 
 * @param {NS} ns 
 */
export async function main(ns) {
    let allTargets = treeScan(ns);
    await scpTransfer(ns, allTargets);
    let bestTarget = await find(ns, allTargets);
    ns.tprint("Targeting: " + bestTarget);
    await hack(ns, allTargets, bestTarget);
}

/**
 * @param {NS}      ns
 * @param {array}   targets
 */
async function scpTransfer(ns, targets) {
    for (let i = 0; i < targets.length; i++) {
        let file = "hack.js"
        let target = targets[i];

        if (!ns.fileExists(file, target)) {
            let response = await ns.scp(file, "home", target);
            if (response) ns.tprint("Copied " + file + " onto " + target);
            else ns.tprint("fuck you");
        }
    }
}

/**
 * @param {NS}      ns
 * @param {array}   targets
 * @param {string}  bestTarget
 */
async function hack(ns, targets, bestTarget) {
    for (let i = 0; i < targets.length; i++) {
        let target = targets[i];
        let file = "hack.js"
        let maxRam = ns.getServerMaxRam(target);
        let scriptRam = ns.getScriptRam(file, target);
        let numberOfThreads = Math.floor(maxRam / scriptRam);
        let selfHackingLevel = ns.getHackingLevel();
        let serverHackingLevel = ns.getServerRequiredHackingLevel(target);

        let scriptPID = 0;
        if (numberOfThreads > 0 && selfHackingLevel >= serverHackingLevel) {
            scriptPID = await ns.exec(file, target, numberOfThreads, bestTarget);
        }

        if (scriptPID > 0) {
            ns.tprint("Running " + file + " on " + target);
        }
    }
}