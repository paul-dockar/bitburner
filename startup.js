export const breachScriptPath = "/utils/breach-all.js";
export const smartHackScriptPath = "/hack/smart-hack.js";
export const prepareServerScriptPath = "/hack/prepare.js";

/** @param {NS} ns **/
export async function main(ns) {
    await ns.run(breachScriptPath, 1);
    await ns.sleep(500);

    let target = "n00dles";
    await ns.run(prepareServerScriptPath, 1, target);
    await ns.sleep(1e4);

    await ns.run(smartHackScriptPath, 1, target);
}