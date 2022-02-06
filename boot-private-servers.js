import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';
import { findNextServer } from '/hack/find.js';
import { TreeNode } from '/classes/tree-node.js';

const SCP_FILES = '/private-server/scp-files.js';
const SMART_HACK = '/hack/smart-hack.js';

/** @param {NS} ns **/
export async function main(ns) {
    await ns.run(SCP_FILES, 1);
    await ns.sleep(4000);

    let serverList = treeSearchAlgorithm(ns);

    let getHackTargets = (serverList) => {
        let player = ns.getPlayer();

        let hackTargets = []
        for (let server of serverList) {
            let so = ns.getServer(server.hostname);
            let node = new TreeNode(so.hostname);

            let serverHacklevel = so.requiredHackingSkill;
            if (serverHacklevel < player.hacking && !so.purchasedByPlayer) {
                hackTargets.push(node);
            }
        }
        return hackTargets;
    }

    let getPrivateServers = (serverList) => {
        let privateServers = [];
        for (let server of serverList) {
            let so = ns.getServer(server.hostname);
            if (so.purchasedByPlayer && so.hostname != "home") {
                privateServers.push(so.hostname);
            }
        }
        return privateServers;
    }

    let runningTargetsArray = [];
    let privateServerArray = getPrivateServers(serverList);

    while (privateServerArray.length > 0) {
        let target = findNextServer(ns, getHackTargets(serverList), runningTargetsArray);
        let host = privateServerArray.shift();

        runningTargetsArray.push(target);

        await ns.run(SMART_HACK, 1, target, host);
        await ns.sleep(1000);



        // ns.tprint(host);
        // ns.tprint(privateServerArray);
        // ns.tprint(JSON.stringify(getHackTargets(serverList)));
        // ns.tprint(`target is ${target}`);

    }

}