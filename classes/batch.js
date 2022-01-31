import { weakenScriptPath, growthScriptPath, hackScriptPath } from '/hack/utils/file-locations.js'

export class Batch {
    constructor(ns, server, player, cores) {
        this.ns = ns;
        this.server = server;
        this.player = player;
        this.cores = cores;
        this.threads = 1;
        this.sleepTime = 0;
        this.scriptTime = 1;
        this.ram = 1;
    }

    setSleepTime(maxScriptTime) {
        const paddingTime = 200;
        this.sleepTime = (maxScriptTime + paddingTime) - this.scriptTime;
        return;
    }
}


export class Hack extends Batch {
    constructor(ns, server, player) {
        super(ns, server, player);
        this.filePath = hackScriptPath;
        this.ram = ns.getScriptRam(this.filePath)

        this.setHackThreads = () => {
            let hackPercent = this.ns.formulas.hacking.hackPercent(this.server, this.player);

            let threads = 0;
            let hackTotalPercent;
            do {
                threads += 1;
                hackTotalPercent = threads * (hackPercent * 100);
            } while (hackTotalPercent < 100);

            this.threads = threads;
            return threads;
        }

        this.setHackTime = () => {
            this.scriptTime = this.ns.formulas.hacking.hackTime(this.server, this.player);
            return;
        }


    }
}

export class Weaken extends Batch {
    constructor(ns, server, player, cores) {
        super(ns, server, player, cores);
        this.filePath = weakenScriptPath;
        this.ram = ns.getScriptRam(this.filePath)
        this.securityDifference = 0;

        this.setWeakenThreads = () => {
            let securityDecrease;
            let threads = 0;
            do {
                securityDecrease = this.ns.weakenAnalyze(threads, cores);
                threads += 1;
            } while (this.securityDifference > securityDecrease);

            this.threads = threads;
            return threads;
        }

        this.setSecurityDifference = (securityIncrease) => {
            this.securityDifference = securityIncrease;
        }

        this.setWeakenTime = () => {
            this.scriptTime = this.ns.formulas.hacking.weakenTime(this.server, this.player);
            return;
        }

    }

    //todo: this shouldnt be needed as server should be prepared beforehand remove this soon.
    sumSecurityDifference(securityIncrease) {
        this.securityDifference += securityIncrease;
        return this.securityDifference;
    }
}

export class Grow extends Batch {
    constructor(ns, server, player, cores) {
        super(ns, server, player, cores);
        this.filePath = growthScriptPath;
        this.ram = ns.getScriptRam(this.filePath)

        this.setGrowThreads = () => {
            let estimatedGrowthMultiplier = Math.ceil(this.server.moneyMax / (this.server.moneyAvailable + 1));

            let threads = 0;
            let growthPercent;
            do {
                threads += 1;
                growthPercent = this.ns.formulas.hacking.growPercent(this.server, threads, this.player, this.cores);
            } while (estimatedGrowthMultiplier > growthPercent / 100);

            this.threads = threads;
            return threads;
        }

        this.setGrowTime = () => {
            this.scriptTime = this.ns.formulas.hacking.growTime(this.server, this.player);
            return;
        }



    }
}