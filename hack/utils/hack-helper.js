import { TreeNode } from '/classes/tree-node.js';
import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';

export const TIME_DELAY_BETWEEN_WORKERS = 60;
export const TIME_DELAY_BETWEEN_BATCHES = TIME_DELAY_BETWEEN_WORKERS * 6;

/**
 * @description If script arguments include "all" then get all servers in the world, else just the single server argument.
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

/**
 * @description collects 3-4 Batch Class objects and returns the max runtime
 * @param {Script} a 
 * @param {Script} b 
 * @param {Script} c 
 * @param {Script} opts 
 * @returns 
 */
export function getMaxTimeFromBatch(a, b, c, opts) {
    let times = []
    times.push(a.scriptTime);
    times.push(b.scriptTime);
    times.push(c.scriptTime);
    if (typeof opts != "undefined") times.push(opts.scriptTime);
    return Math.ceil(Math.max(...times));
}

/**
 * @description collects 3-4 Batch Class objects and returns the sum of all their ram used.
 * @param {Script} a 
 * @param {Script} b 
 * @param {Script} c 
 * @param {Script} opts 
 * @returns 
 */
export function getSumRamFromBatch(a, b, c, opts) {
    let maxram = 0;
    maxram += (a.threads * a.ram);
    maxram += (b.threads * b.ram);
    maxram += (c.threads * c.ram);
    if (typeof opts != "undefined") maxram += (opts.threads * opts.ram);
    return Math.ceil(maxram);
}