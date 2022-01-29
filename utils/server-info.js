/**
 * @description Returns true if there is enough RAM available on current server to exec script with the required threads
 * @param {number} threads 
 * @param {number} maxRam 
 * @param {number} usedRam 
 * @returns {boolean}
 */
export function isRamAvailable(threads, maxRam, usedRam, scriptRam) {
    return threads * scriptRam < maxRam - usedRam;
}

/** 
 * @description Returns how many cpu cores are on player owned servers
 * @param  {NS} ns
 * @param  {string} host
 * @returns {number}
 */
/** */
export function getCpuCores(ns) {
    const hostname = ns.getHostname()
    let server = ns.getServer(hostname);
    let cores = 1;
    if (server.purchasedByPlayer) {
        cores = server.cpuCores;
    }
    return cores;
}