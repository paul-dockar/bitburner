import { convertToInternationalCurrencySystem } from '/old/find-hack-target.js';

/** @param {NS} ns **/
export async function main(ns) {
    const ram = 1048576;
    const prefix = "pserv-1024tb-";

    let lastServer = ns.scan("home").pop();
    const regex = new RegExp('^.*tb-([0-9]+)');
    let lastServerId = lastServer.match(regex);

    if (lastServerId != null) {
        lastServerId = parseInt(lastServerId.pop());
        lastServerId++;
    } else {
        lastServerId = 0;
    }

    for (let i = lastServerId; i < 25; ++i) {
        let cost = ns.getPurchasedServerCost(ram);
        cost = convertToInternationalCurrencySystem(cost);
        ns.tprint("cost of server: " + cost);
        let response = ns.purchaseServer(prefix + (i), ram);
        ns.tprint("response: " + response);
    }
}

/*
const ram = 8192;
const ram = 16384;
const ram = 32768;
const ram = 65536;
const ram = 131072;
const ram = 262144;
const ram = 524288;
const ram = 1048576;
*/