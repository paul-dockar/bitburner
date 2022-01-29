import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';
import { sortMap } from '/utils/array-sort.js'


/** @param {NS} ns **/
export async function main(ns) {
    let serverList = treeSearchAlgorithm(ns);
    for (let server of serverList) {
        ns.tprint("Name: " + server.hostname + ". Child: " + server.children + ". Parent: " + server.parent);
    }
    let sortedServerList = find(ns, serverList);
    for (let server of sortedServerList) {
        ns.tprint("Server scores: " + server);
    }
}

/** 
 * @param  {NS} ns
 * @param  {Array<Object>} list 
 * @returns {Map}
 */
export function find(ns, list) {
    let map = new Map();
    for (let node of list) {
        let player = ns.getPlayer();
        let server = ns.getServer();
        let hackAnalyzeChance = ns.hackAnalyzeChance(node.hostname);
        let maxMoney = ns.getServerMaxMoney(node.hostname);
        let weakenTime = ns.getWeakenTime(node.hostname);
        let score = Math.round((maxMoney * hackAnalyzeChance) / weakenTime);

        map.set(node.hostname, score);
    }
    let sortedMap = sortMap(map);
    for (let x of sortedMap) {
        //ns.tprint(x);
    }
    return sortedMap;
}