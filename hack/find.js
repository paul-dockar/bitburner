import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';
import { sortMap } from '/utils/array-sort.js'
import { currencyAbrev } from '/utils/convert-money.js'


/** @param {NS} ns **/
export async function main(ns) {
    let serverList = treeSearchAlgorithm(ns);
    for (let server of serverList) {
        ns.tprint("Name: " + server.hostname + ". Child: " + server.children + ". Parent: " + server.parent);
    }
    let sortedServerList = find(ns, serverList);
    sortedServerList.forEach(logMapElements);

    function logMapElements(value, key, map) {
        let maxMoney = currencyAbrev(ns.getServerMaxMoney(key));
        let server = ns.getServer(key);

        ns.tprint(`[${key}] = scoreOf ${value}. maxMoney = ${maxMoney}. availMoney = ${currencyAbrev(server.moneyAvailable)}. currentSecurity = ${server.hackDifficulty}. minSecurity = ${server.minDifficulty}`);
    }

    // todo: make pretty table in the future. need a server object first though.
    // const row = '%-20s | %8s | %12s | %12s';
    // ns.tprintf(row, 'HOSTNAME', 'HACK LVL', 'MAX $$', 'CASH $$');
    // ns.tprintf(row, '---------', '-------', '------', '-------');
    // for (const target of potentialTargets) {
    //     ns.tprintf(row, target.hostname,
    //         ns.nFormat(target.requiredHackingLevel,	'0,0'),
    //         ns.nFormat(target.maxMoney,'($ 0.00 a)'),
    //         ns.nFormat(target.MoneyAvailable,'($ 0.00 a)')
    //         );
    // }


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

    return sortMap(map);
}