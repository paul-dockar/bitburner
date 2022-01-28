import { treeSearchAlgorithm } from '/scripts/tree-search-algorithm.js';
//import { Server } from '/classes/server.js';


/** @param {NS} ns **/
export async function main(ns) {
    let serverList = treeSearchAlgorithm(ns);
    let targetServer = find(ns, serverList);
}

/** 
 * @param  {NS} ns
 * @param  {Array<Object>} list 
 * @return {String} string
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
}

/** 
 * @description - Takes a Map, converts into an array and sorts on the map.value, converts to map and return.
 * @param  {Map} m
 * @return {Map}
 */
function sortMap(m) {
    let a = [];
    for (let x of m)
        a.push(x);

    a.sort(function(x, y) {
        return x[1] - y[1];
    });

    return new Map(a);
}