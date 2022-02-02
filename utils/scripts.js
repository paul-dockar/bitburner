export function disableLogs(ns) {
    ns.disableLog("disableLog");
    ns.disableLog("sleep");
    ns.disableLog("getServerMaxRam");
    ns.disableLog("getServerUsedRam");
}