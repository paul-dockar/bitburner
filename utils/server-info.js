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