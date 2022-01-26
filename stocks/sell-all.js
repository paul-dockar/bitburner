import { sell } from '/stocks/stock-market.js';

/** @param {NS} ns **/
export async function main(ns) {
    let stockSymbols = ns.stock.getSymbols();
    for (let sym of stockSymbols) {
        let [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(sym);
        let sale = sell(ns, sym, shares);
        if (sale > 0) {
            ns.tprint("Sold all shares for " + sym + ". Total profit/loss = $" + (shares * sale));
        }
    }
}