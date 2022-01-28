/**
 * Server - 
 * @param {string} hostname
 */
export class Server {
    constructor(ns, hostname, player) {
        this.hostname = hostname;
        this.server = ns.getServer(this.hostname);
        this.hackChance = ns.formulas.hacking.hackChance(this.server, player);
        this.weakenTime = ns.formulas.hacking.weakenTime(this.server, player);
    }

    getScore() {
        return Math.round((this.server.moneyMax * this.hackChance) / this.weakenTime);
    }
}