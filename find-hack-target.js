import { treeScan } from '/tree-scan.js'

/** @param {NS} ns **/
export async function main(ns) {
    let allTargets = treeScan(ns);
    await find(ns, allTargets);
}

export async function find(ns, targets) {
    let servers = new Map();
    let serversMoney = new Map();

    for (let i = 0; i < targets.length; i++) {
        let target = targets[i];
        let serverHackingLevel = ns.getServerRequiredHackingLevel(target);
        let selfHackingLevel = ns.getHackingLevel();
        let serverMaxMoney = ns.getServerMaxMoney(target);
        let serverMinSecurityLevel = ns.getServerMinSecurityLevel(target);

        let serverTimeOverMoney = serverMaxMoney / serverMinSecurityLevel;

        if (selfHackingLevel >= serverHackingLevel && ns.hasRootAccess(target)) {
            //if (1) {
            servers.set(target, serverTimeOverMoney);
            serversMoney.set(target, serverMaxMoney);
        }
    }

    let highestValue = 0;
    let highestKey = "";
    for (let [key, value] of servers) {
        if (value > highestValue) {
            highestKey = key;
            highestValue = value;
        }
    }

    serversMoney[Symbol.iterator] = function*() {
        yield*[...this.entries()].sort((a, b) => a[1] - b[1]);
    }

    for (let [key, value] of serversMoney) { // get data sorted
        ns.tprint(key + ' ' + convertToInternationalCurrencySystem(value));
    }

    ns.tprint(serversMoney);

    for (let [key, value] of serversMoney) {
        let serverHackingLevel = ns.getServerRequiredHackingLevel(key);
        ns.tprint(key + ' ' + serverHackingLevel);
    }

    //ns.tprint([...serversMoney]);



    ns.tprint("Best server to hack: " + highestKey);
    ns.tprint(highestKey + " has max money of $" + convertToInternationalCurrencySystem(ns.getServerMaxMoney(highestKey)) +
        " and hackingLevelRequired = " + ns.getServerRequiredHackingLevel(highestKey));

    let file = "hack.js"
    let maxRam = ns.getServerMaxRam("home");
    let scriptRam = ns.getScriptRam(file, "home");
    let threads = Math.floor(maxRam / scriptRam);

    ns.tprint("Threads to use : " + threads);
    return highestKey;
}

export function convertToInternationalCurrencySystem(labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9 ?
        (Math.abs(Number(labelValue)) / 1.0e+9).toFixed(2) + "B"
        // Six Zeroes for Millions 
        :
        Math.abs(Number(labelValue)) >= 1.0e+6 ?
        (Math.abs(Number(labelValue)) / 1.0e+6).toFixed(2) + "M"
        // Three Zeroes for Thousands
        :
        Math.abs(Number(labelValue)) >= 1.0e+3 ?
        (Math.abs(Number(labelValue)) / 1.0e+3).toFixed(2) + "K" :
        Math.abs(Number(labelValue));

}