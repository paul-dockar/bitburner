import { TreeNode } from '/classes/tree-node.js'
import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js'

/**
 * 
 * @param {NS} ns 
 * @returns {array}
 */
export function getServersFromParams(ns) {
    let arg = ns.args[0];
    if (arg == null) {
        ns.tprint("Please include argument; server.hostname or 'all'");
        ns.exit();
    }

    let serverList = [];

    if (arg == "all") {
        serverList = treeSearchAlgorithm(ns);
    } else {
        let server = new TreeNode(arg);
        serverList.push(server);
    }
    return serverList;
}

/**
 * @description Returns true if there is enough RAM available on current server to exec script with the required threads
 * @param {number} threads 
 * @param {number} maxRam 
 * @param {number} usedRam 
 * @returns {boolean}
 */
export function isRamAvailable(maxRam, usedRam, scriptRam) {
    return scriptRam < maxRam - usedRam;
}

export function getMaxTimeFromBatch(a, b, c, opts) {
    let times = []
    times.push(a.scriptTime);
    times.push(b.scriptTime);
    times.push(c.scriptTime);
    if (typeof opts != "undefined") times.push(opts.scriptTime)
    return Math.ceil(Math.max(...times));
}

export function getMaxRamFromBatch(a, b, c, opts) {
    let maxram = 0;
    maxram += (a.threads * a.ram);
    maxram += (b.threads * b.ram);
    maxram += (c.threads * c.ram);
    if (typeof opts != "undefined") maxram += (opts.threads * opts.ram);
    return Math.ceil(maxram);
}