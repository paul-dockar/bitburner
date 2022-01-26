/**
 * Stocks
 * @param {string} name
 * @param {NS} ns
 */
export class Stocks {
    constructor(name, ns) {
        this.name = name;
        this.forecast = ns.stock.getForecast(this.name);
        this.maxShares = ns.stock.getMaxShares(this.name);
        this.volatility = ns.stock.getVolatility(this.name);
        this.askPrice = ns.stock.getAskPrice(this.name);
    }
}