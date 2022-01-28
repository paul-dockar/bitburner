/** @param {NS} ns **/
export async function main(ns) {
    let maxNodes = parseInt(ns.args[0]);
    let currentNodes = ns.hacknet.numNodes();
    const maxHacknetLevel = 200;
    const maxHacknetRam = 64;
    const maxHacknetCpu = 16;
    let player = new ns.getPlayer();

    for (currentNodes; currentNodes < maxNodes; i++) {
        if (ns.hacknet.getPurchaseNodeCost() < player.money) {
            let purchaseResponse = purchaseNode(ns, maxNodes);
            if (purchaseResponse == maxNodes) {
                ns.tprint("Current # of hacknet nodes = " + purchaseResponse);
            }
        } else {
            break;
        }
    }

    await upgradeLevel(ns, maxNodes, maxHacknetLevel);
    await upgradeRam(ns, maxNodes, maxHacknetRam);
    await upgradeCore(ns, maxNodes, maxHacknetCpu);
}

async function purchaseNode(ns, maxNodes) {
    while (ns.hacknet.numNodes() < maxNodes) {
        await ns.hacknet.purchaseNode();
    }
    return ns.hacknet.numNodes();
}

async function upgradeLevel(ns, maxNodes, level) {
    for (let i = 0; i < maxNodes; i++) {
        while (ns.hacknet.getNodeStats(i).level < level) {
            let Player = new ns.getPlayer
            let money = Player.money;
            let cost = ns.hacknet.getLevelUpgradeCost(i, 1)
            while (money < cost) {
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeLevel(i, 1);
        }
    }
    ns.tprint("Purchased all hacknet level upgrades");
}

async function upgradeRam(ns, maxNodes, level) {
    for (let i = 0; i < maxNodes; i++) {
        while (ns.hacknet.getNodeStats(i).ram < level) {
            let Player = new ns.getPlayer
            let money = Player.money;
            let cost = ns.hacknet.getRamUpgradeCost(i, 1)
            while (money < cost) {
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeRam(i, 1);
        }
    }
    ns.tprint("Purchased all hacknet ram upgrades");
}

async function upgradeCore(ns, maxNodes, level) {
    for (let i = 0; i < maxNodes; i++) {
        while (ns.hacknet.getNodeStats(i).cores < level) {
            let Player = new ns.getPlayer
            let money = Player.money;
            let cost = ns.hacknet.getCoreUpgradeCost(i, 1)
            while (money < cost) {
                await ns.sleep(3000);
            }
            ns.hacknet.upgradeCore(i, 1);
        }
    }
    ns.tprint("Purchased all hacknet core upgrades");
}