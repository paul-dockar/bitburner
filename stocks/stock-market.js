import { Stocks } from '/stocks/classes/stocks.js'
import { currencyAbrev } from '/helper/convert-money.js'

const BULL_MARKET = 0.6; //Default 0.6. A stock has a 60% chance of increasing in price
const BEAR_MARKET = 0.5; //Default 0.5. A stock has a 50% chance of decreasing in price.
const MAX_CAPITAL_PERCENT = 0.6; //e.g. If player has $1T, only invest up to $600B per purchase.

/** @param {NS} ns **/
export async function main(ns) {
    ns.disableLog("sleep");

    if (!ns.stock.purchase4SMarketData() || !ns.stock.purchase4SMarketDataTixApi()) {
        ns.tprint("Get more money to buy the stockmarket data shit you idiot");
        ns.exit;
    }

    await stockMarket(ns);
}

/** @param {NS} ns **/
async function stockMarket(ns) {
    while (true) {
        let stockSymbols = ns.stock.getSymbols();
        for (let sym of stockSymbols) {
            let company = new Stocks(sym, ns);
            let [shares, avgPx, sharesShort, avgPxShort] = ns.stock.getPosition(sym);
            if (shares > 0 && company.forecast < BEAR_MARKET) {
                sell(ns, sym, shares, avgPx);
            }
            if (shares === 0 && company.forecast > BULL_MARKET) {
                buy(ns, sym, company);
            }
        }

        await ns.sleep(3000);
    }
}

/**
 * @param 	{NS} 		ns
 * @param 	{string} 	sym - stock symbol
 * @param 	{number} 	shares - number of shares
 * @param 	{number}	avgPx - average price stocks were bought for
 * @return 	{number} 	The stock price at which each share was sold, otherwise 0 if shares wern't sold.
 */
export function sell(ns, sym, shares, avgPx) {
    let buyPrice = shares * avgPx;
    let sellPrice = ns.stock.getSaleGain(sym, shares, "Long");
    let sale = ns.stock.sell(sym, shares)
    let profit = sellPrice - buyPrice
    ns.print(sym + " profit = $" + currencyAbrev(profit));
    return sale;
}

/**
 * @param 	{NS} 		ns
 * @param 	{string} 	sym - stock symbol
 * @param 	{Stocks} 	Stock class (company)
 * @return 	{number}  	The stock price at which each share was purchased, otherwise 0 if the shares weren't purchased.
 */
export function buy(ns, sym, company) {
    let player = ns.getPlayer();
    let moneyThreshold = player.money * MAX_CAPITAL_PERCENT;
    let shares = Math.floor(moneyThreshold / company.askPrice);
    if (shares > company.maxShares) shares = company.maxShares;
    return ns.stock.buy(sym, shares);
}