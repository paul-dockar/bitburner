import { treeSearchAlgorithm } from '/utils/tree-search-algorithm.js';
import { findNextServer } from '/hack/find.js';
import { TreeNode } from '/classes/tree-node.js';

const SMART_HACK = '/hack/smart-hack.js';

/** @param {NS} ns **/
export async function main(ns) {
    let serverList = treeSearchAlgorithm(ns);

    let getHackTargets = (serverList) => {
        let player = ns.getPlayer();

        let hackTargets = []
        for (let server of serverList) {
            let so = ns.getServer(server.hostname);
            let node = new TreeNode(so.hostname);

            let serverHacklevel = so.requiredHackingSkill;
            if (serverHacklevel < player.hacking && !so.purchasedByPlayer && so.hasAdminRights) {
                hackTargets.push(node);
            }
        }
        return hackTargets;
    }

    let runningTargetsArray = [];

    while (runningTargetsArray.length < 40) {
        let target = findNextServer(ns, getHackTargets(serverList), runningTargetsArray);
        let host = "home";

        runningTargetsArray.push(target);

        let run = await ns.run(SMART_HACK, 1, target, host);
        ns.tprint(`PID = ${run}, started ${SMART_HACK} on ${host}. Targeting ${target}.`);
        await ns.sleep(1000);
    }
}