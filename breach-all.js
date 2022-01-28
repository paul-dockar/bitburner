import { treeScan } from '/tree-scan.js'

/** @param {NS} ns **/
export async function main(ns) {
    let allTargets = treeScan(ns);
    breach(ns, allTargets);
}

function breach(ns, targets) {
    for (let i = 0; i < targets.length; i++) {
        let currentTarget = targets[i];
        let portsOpened = runExeHacks(ns, currentTarget);
        runNuke(ns, currentTarget, portsOpened);
    }
}

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

function runNuke(ns, target, openPorts) {
    let portsRequired = ns.getServerNumPortsRequired(target)
    if (openPorts >= portsRequired) {
        ns.nuke(target);
        //ns.installBackdoor(target);
        if (ns.hasRootAccess(target)) {
            ns.tprint("Root Access granted on " + target + ". Total ports opened: " + openPorts)
        }
    } else {
        ns.tprint("Root access NOT granted on " + target + ". Total ports opened: " + openPorts + ". Total ports required: " + portsRequired)
    }
}