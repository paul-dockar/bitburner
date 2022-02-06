import { weakenScriptPath, growthScriptPath, hackScriptPath } from '/hack/utils/file-locations.js';

export class Script {
    constructor(ns, server, player, cores) {
        this.ns = ns;
        this.server = server;
        this.player = player;
        this.cores = cores;
        this.threads = 1;
        this.sleepTime = 0;
        this.scriptTime = 1;
        this.executionDateTime = 1;
        this.ram = 1;
    }

    /**
     * @description Calculates the required delay time for the worker scripts so they finish at the same time (20ms one after the other)
     * @param {number} maxScriptTime - execution time of the script in milliseconds.
     * @returns 
     */
    setSleepTime(maxScriptTime, paddingTime) {
        this.sleepTime = (paddingTime + maxScriptTime) - this.scriptTime;
        return;
    }

    setExecDateTime(currentTime) {
        this.executionDateTime = this.sleepTime + currentTime;
        return;
    }
}

export class Hack extends Script {
    constructor(ns, server, player) {
        super(ns, server, player);
        this.filePath = hackScriptPath;
        this.ram = ns.getScriptRam(this.filePath)
    }

    /**
     * @description Calculates the required hack threads to hack servers max money.
     * @returns 
     */
    async setHackThreads() {
        try {
            var ___timeout___ = Date.now();

            let hackPercent = this.ns.formulas.hacking.hackPercent(this.server, this.player);
            let threads = 0;
            let hackTotalPercent;
            do {
                if (Date.now() > ___timeout___ + 1000) {
                    throw new Error('Timed out');
                }
                threads += 1;
                hackTotalPercent = threads * (hackPercent * 100);
            } while (hackTotalPercent < 100);

            this.threads = threads;
            return;
        } catch (e) {
            this.ns.tprint(e);
            this.ns.tprint(`Server ${this.server.hostname} hack difficulty reached 100. Something went wrong. Aborting script`);
            this.ns.tprint(`Threads = ${this.threads}, hackPercent = ${hackPercent}% hackTotalPercent = ${hackTotalPercent}%`);
            this.ns.exit();
        }
    }

    setHackTime() {
        this.scriptTime = this.ns.formulas.hacking.hackTime(this.server, this.player);
        return;
    }

    setDumbHackThreads() {
        this.threads = this.ns.hackAnalyzeThreads(this.server.hostname, this.server.moneyMax);
        return;
    }

    setDumbHackTime() {
        this.scriptTime = this.ns.getHackTime(this.server.hostname, this.player.hacking);
        return;
    }
}

export class Weaken extends Script {
    constructor(ns, server, player, cores) {
        super(ns, server, player, cores);
        this.filePath = weakenScriptPath;
        this.ram = ns.getScriptRam(this.filePath)
        this.securityDifference = 0;
    }

    /**
     * @description Calculates threads required to weaken the server back to minimum
     * @returns 
     */
    setWeakenThreads() {
        let securityDecrease;
        let threads = 0;
        do {
            securityDecrease = this.ns.weakenAnalyze(threads, this.cores);
            threads += 1;
        } while (this.securityDifference > securityDecrease);

        this.threads = threads;
        return;
    }

    /**
     * 
     * @param {number} securityIncrease 
     */
    setSecurityDifference(securityIncrease) {
        this.securityDifference = securityIncrease;
        return;
    }

    setWeakenTime() {
        this.scriptTime = this.ns.formulas.hacking.weakenTime(this.server, this.player);
        return;
    }

    setDumbWeakenTime() {
        this.scriptTime = this.ns.getWeakenTime(this.server.hostname, this.player.hacking);
        return;
    }
}

export class Grow extends Script {
    constructor(ns, server, player, cores) {
        super(ns, server, player, cores);
        this.filePath = growthScriptPath;
        this.ram = ns.getScriptRam(this.filePath)
    }

    /**
     * @description - Calculates grow threads required to grow a server from $0 to max $
     * @returns 
     */
    setGrowThreads() {
        let estimatedGrowthMultiplier = Math.ceil(this.server.moneyMax / 1);
        let threads = 0;
        let growthPercent;
        do {
            threads += 1;
            growthPercent = this.ns.formulas.hacking.growPercent(this.server, threads, this.player, this.cores);
        } while (estimatedGrowthMultiplier > growthPercent / 100);

        this.threads = threads;
        return;
    }

    setGrowTime() {
        this.scriptTime = this.ns.formulas.hacking.growTime(this.server, this.player);
        return;
    }

    setDumbGrowThreads() {
        this.threads = this.ns.growthAnalyze(Math.abs(this.server.hostname, this.server.moneyMax / 1));
        return;
    }

    setDumbGrowTime() {
        this.scriptTime = this.ns.getGrowTime(this.server.hostname, this.player.hacking);
        return;
    }
}