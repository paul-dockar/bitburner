import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';
const row = '| %-24s | %-5s | %-10s | %-6s | %-9s | %-9s |';

/** @param {NS} ns **/
export async function main(ns) {
    let serverList = treeSearchAlgorithm(ns);

    ns.tprint("\r\n\r\n\r\n __\/\\\\\\\\\\\\\\\\\\\\\\\\\\___        ____\/\\\\\\\\\\\\\\\\\\_____        __\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_        _____\/\\\\\\\\\\\\\\\\\\____        ________\/\\\\\\\\\\\\\\\\\\_        __\/\\\\\\________\/\\\\\\_        \r\n _\\\/\\\\\\\/\/\/\/\/\/\/\/\/\\\\\\_        __\/\\\\\\\/\/\/\/\/\/\/\\\\\\___        _\\\/\\\\\\\/\/\/\/\/\/\/\/\/\/\/__        ___\/\\\\\\\\\\\\\\\\\\\\\\\\\\__        _____\/\\\\\\\/\/\/\/\/\/\/\/__        _\\\/\\\\\\_______\\\/\\\\\\_       \r\n  _\\\/\\\\\\_______\\\/\\\\\\_        _\\\/\\\\\\_____\\\/\\\\\\___        _\\\/\\\\\\_____________        __\/\\\\\\\/\/\/\/\/\/\/\/\/\\\\\\_        ___\/\\\\\\\/___________        _\\\/\\\\\\_______\\\/\\\\\\_      \r\n   _\\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\__        _\\\/\\\\\\\\\\\\\\\\\\\\\\\/____        _\\\/\\\\\\\\\\\\\\\\\\\\\\_____        _\\\/\\\\\\_______\\\/\\\\\\_        __\/\\\\\\_____________        _\\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_     \r\n    _\\\/\\\\\\\/\/\/\/\/\/\/\/\/\\\\\\_        _\\\/\\\\\\\/\/\/\/\/\/\\\\\\____        _\\\/\\\\\\\/\/\/\/\/\/\/______        _\\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_        _\\\/\\\\\\_____________        _\\\/\\\\\\\/\/\/\/\/\/\/\/\/\\\\\\_    \r\n     _\\\/\\\\\\_______\\\/\\\\\\_        _\\\/\\\\\\____\\\/\/\\\\\\___        _\\\/\\\\\\_____________        _\\\/\\\\\\\/\/\/\/\/\/\/\/\/\\\\\\_        _\\\/\/\\\\\\____________        _\\\/\\\\\\_______\\\/\\\\\\_   \r\n      _\\\/\\\\\\_______\\\/\\\\\\_        _\\\/\\\\\\_____\\\/\/\\\\\\__        _\\\/\\\\\\_____________        _\\\/\\\\\\_______\\\/\\\\\\_        __\\\/\/\/\\\\\\__________        _\\\/\\\\\\_______\\\/\\\\\\_  \r\n       _\\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\/__        _\\\/\\\\\\______\\\/\/\\\\\\_        _\\\/\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\_        _\\\/\\\\\\_______\\\/\\\\\\_        ____\\\/\/\/\/\\\\\\\\\\\\\\\\\\_        _\\\/\\\\\\_______\\\/\\\\\\_ \r\n        _\\\/\/\/\/\/\/\/\/\/\/\/\/\/____        _\\\/\/\/________\\\/\/\/__        _\\\/\/\/\/\/\/\/\/\/\/\/\/\/\/\/__        _\\\/\/\/________\\\/\/\/__        _______\\\/\/\/\/\/\/\/\/\/__        _\\\/\/\/________\\\/\/\/__\r\n\r\n");
    ns.tprintf(row, "------------------------", "-----", "------", "------", "---------", "---------");
    ns.tprintf(row, "hostname", "level", "$", "rooted", "backdoord", "openPorts", );
    ns.tprintf(row, "------------------------", "-----", "------", "------", "---------", "---------");

    breach(ns, serverList);
}

function breach(ns, list) {
    for (let node of list) {
        if (node.hostname != "home") {
            let target = node.hostname;
            let portsOpened = runExeHacks(ns, target);
            runNuke(ns, target, portsOpened);
        }
    }
}

/**
 * 
 * @param {NS} ns 
 * @param {string} target 
 * @returns {number}
 */
function runExeHacks(ns, target) {
    let ports = 0;
    if (ns.fileExists("BruteSSH.exe", "home")) {
        ns.brutessh(target);
        ports++;
    }
    if (ns.fileExists("FTPCrack.exe", "home")) {
        ns.ftpcrack(target);
        ports++;
    }
    if (ns.fileExists("relaySMTP.exe", "home")) {
        ns.relaysmtp(target);
        ports++;
    }
    if (ns.fileExists("HTTPWorm.exe", "home")) {
        ns.httpworm(target);
        ports++;
    }
    if (ns.fileExists("SQLInject.exe", "home")) {
        ns.sqlinject(target);
        ports++;
    }
    return ports;
}

/**
 * 
 * @param {NS} ns 
 * @param {string} target 
 * @param {number} openPorts 
 */
function runNuke(ns, target, openPorts) {
    let portsRequired = ns.getServerNumPortsRequired(target)
    if (openPorts >= portsRequired) {
        ns.nuke(target);
        //ns.installBackdoor(target);
    }
    let so = ns.getServer(target);
    let hostname = so.hostname;
    let level = so.requiredHackingSkill;
    let money = so.moneyMax;
    let isRooted = so.hasAdminRights;
    let isBackdoor = so.backdoorInstalled;
    let isPlayerOwned = so.purchasedByPlayer;

    if (!isPlayerOwned) {
        ns.tprintf(row, hostname, level, ns.nFormat(money, '($ 0.00 a)'), isRooted, isBackdoor, openPorts);
    }
}