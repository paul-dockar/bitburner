import { convertToInternationalCurrencySystem } from '/find-hack-target.js'

/** @param {NS} ns **/
export async function main(ns) {
    const MAX_RAM = 1048576;
    let ram = 512;
    let cost = 0;
    let formattedCost = "";
    let formattedRam = "";
    while (ram < MAX_RAM) {
        ram = ram * 2;
        cost = ns.getPurchasedServerCost(ram);
        formattedCost = convertToInternationalCurrencySystem(cost);
        formattedRam = formatBytes(ram);
        ns.tprint("Cost of " + formattedRam + " server = $" + formattedCost);
    }
}

/** @param {number} bytes 
 * **/
function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}