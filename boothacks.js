const STOCK_MARKET = '/stocks/stock-market.js'
const SMART_HACK = '/hack/smart-hack.js'

/** @param {NS} ns **/
export async function main(ns) {
    await ns.run(STOCK_MARKET, 1);
    await ns.sleep(1e3);
    await ns.run(SMART_HACK, 1, 'ecorp');
    await ns.sleep(1e4);
    await ns.run(SMART_HACK, 1, 'megacorp');
    await ns.sleep(1e4);
    await ns.run(SMART_HACK, 1, 'blade');
    await ns.sleep(1e4);
    await ns.run(SMART_HACK, 1, 'b-and-a');
    await ns.sleep(1e4);
    await ns.run(SMART_HACK, 1, 'nwo');
    await ns.sleep(1e4);
    await ns.run(SMART_HACK, 1, 'kuai-gong');
    await ns.sleep(1e4);

}