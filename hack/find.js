import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';
import { sortMap } from '/utils/array-sort.js';

/** @param {NS} ns **/
export async function main(ns) {
    let serverList = treeSearchAlgorithm(ns);
    let player = ns.getPlayer();

    let levelSortedServerList = sortByLevel(ns, serverList);
    printServers(ns, levelSortedServerList);

    // const runningServers = ['blade', 'ecorp', 'megacorp'];
    // findNextServer(ns, serverList, runningServers);
}

/**
 * 
 * @param {NS} ns 
 * @param {Map} levelSortedServerList 
 */
function printServers(ns, levelSortedServerList) {
    let checkPorts = (so) => {
        let count = 0;
        if (so.ftpPortOpen) count++;
        if (so.httpPortOpen) count++;
        if (so.smtpPortOpen) count++;
        if (so.sqlPortOpen) count++;
        if (so.sshPortOpen) count++;
        return count;
    };

    ns.tprint("\r\n\r\n\r\n \/$$$$$$$$ \/$$$$$$ \/$$   \/$$ \/$$$$$$$ \r\n| $$_____\/|_  $$_\/| $$$ | $$| $$__  $$\r\n| $$        | $$  | $$$$| $$| $$  \\ $$\r\n| $$$$$     | $$  | $$ $$ $$| $$  | $$\r\n| $$__\/     | $$  | $$  $$$$| $$  | $$\r\n| $$        | $$  | $$\\  $$$| $$  | $$\r\n| $$       \/$$$$$$| $$ \\  $$| $$$$$$$\/\r\n|__\/      |______\/|__\/  \\__\/|_______\/ ");
    const row = '| %-24s | %-5s | %-5s | %-10s | %-6s | %-6s | %-6s | %-9s | %-9s | %7s | %8s |';
    ns.tprintf(row, "------------------------", "-----", "-----", "-------", "------", "------", "------", "---------", "---------", "-------", "--------");
    ns.tprintf(row, "hostname", "level", "hack%", "$", "minSec", "growth", "rooted", "backdoord", "openPorts", "score", "prepared");
    ns.tprintf(row, "------------------------", "-----", "-----", "----------", "------", "------", "------", "---------", "---------", "-------", "--------");
    for (let server of levelSortedServerList) {
        let so = ns.getServer(server[0]);
        let hostname = so.hostname;
        let level = so.requiredHackingSkill;
        let money = so.moneyMax;
        let minSec = so.minDifficulty;
        let isRooted = so.hasAdminRights;
        let isBackdoor = so.backdoorInstalled;
        let openPorts = checkPorts(so);
        let isPlayerOwned = so.purchasedByPlayer;
        let serverGrowth = so.serverGrowth;

        let { hackPerc, score } = calculateScore(ns, so, money, minSec);

        let isServerPrepared = (so) => {
            if (so.moneyAvailable != so.moneyMax) return false;
            if (so.hackDifficulty != so.minDifficulty) return false;
            return true;
        }

        if (!isPlayerOwned) {
            ns.tprintf(row, hostname, level, ns.nFormat(hackPerc, '0%'), ns.nFormat(money, '($ 0.00 a)'), minSec, serverGrowth, isRooted, isBackdoor, openPorts, ns.nFormat(score, '0.0a'), isServerPrepared(so));
        }
    }
}

/**
 * 
 * @param {NS} ns 
 * @param {Server} so 
 * @param {number} money 
 * @param {number} minSec 
 * @returns 
 */
function calculateScore(ns, so, money, minSec) {
    let player = ns.getPlayer();
    let score;
    let hackPerc;
    if (ns.fileExists("Formulas.exe")) {
        let weakenTime = ns.formulas.hacking.weakenTime(so, player);
        hackPerc = ns.formulas.hacking.hackChance(so, player);
        score = Math.round(money * hackPerc * so.serverGrowth / weakenTime);
    } else {
        hackPerc = ns.hackAnalyzeChance(so.hostname);
        score = Math.round((money * hackPerc) / 1 / minSec);
    }
    return { hackPerc, score };
}

/** 
 * @param  {NS} ns
 * @param  {Array<Object>} list 
 * @returns {Map}
 */
export function sortByLevel(ns, list) {
    let map = new Map();
    for (let node of list) {
        let so = ns.getServer(node.hostname);
        let level = so.requiredHackingSkill;

        map.set(node.hostname, level);
    }

    return sortMap(map);
}

/** 
 * @param  {NS} ns
 * @param  {Array<Object>} list 
 * @returns {Map}
 */
export function sortByScore(ns, list) {
    let map = new Map();
    for (let node of list) {
        let so = ns.getServer(node.hostname);
        let money = so.moneyMax;
        let minSec = so.minDifficulty;
        let { hackPerc, score } = calculateScore(ns, so, money, minSec);

        map.set(node.hostname, score);
    }

    return sortMap(map);
}

/**
 * 
 * @param {NS} ns 
 * @param {Map} serverList 
 * @param {Array} runningServersArray
 * @returns {string} next server hostname
 */
export function findNextServer(ns, serverList, runningServersArray) {
    let scoreSortedServerMap = sortByScore(ns, serverList);

    for (let allServers of scoreSortedServerMap) {
        //remove servers already running from the scoreSortedServerMap
        for (let runningServer of runningServersArray) {
            if (runningServer === allServers[0]) {
                let removed = scoreSortedServerMap.delete(allServers[0]);
            }
        }
    }

    //printServers(ns, scoreSortedServerMap);

    return Array.from(scoreSortedServerMap.keys()).pop();;
}