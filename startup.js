export const breachScriptPath = "/utils/breach-all.js";
export const smartHackScriptPath = "/hack/smart-hack.js";
export const prepareServerScriptPath = "/hack/prepare.js";

/** @param {NS} ns **/
export async function main(ns) {
    await ns.run(breachScriptPath, 1);
    await ns.sleep(500);

    let target = "n00dles";
    let pid = await ns.run(prepareServerScriptPath, 1, target);

    let ps = ns.ps("home");
    while (ps.length > 1) {
        ps = ns.ps("home");
        await ns.sleep(1000);
    }

    await ns.run(smartHackScriptPath, 1, target);
}