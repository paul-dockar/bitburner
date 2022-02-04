export const breachScriptPath = "/utils/breach-all.js";
export const smartHackScriptPath = "/hack/smart-hack.js";
export const prepareServerScriptPath = "/hack/prepare.js";
export const dumbHackPath = "/hack/dumb-hack.js";

/** @param {NS} ns **/
export async function main(ns) {
    const HOST = ns.getHostname();
    const MAX_RAM = ns.getServerMaxRam(HOST);

    ns.run(breachScriptPath, 1);
    await ns.sleep(500);

    //run super dumb hack because not enough ram to run a batch

    let ramEfficient = await ns.prompt("Do you want to run this RAM efficiently?");
    if (ramEfficient) {
        let threads = Math.floor(MAX_RAM / ns.getScriptRam(dumbHackPath));
        ns.tprint(`Run /hack/dumb-hack.js with ${threads} threads`);
        ns.exit();
    }

    let target = "n00dles";
    let pid = ns.run(prepareServerScriptPath, 1, target, ramEfficient);

    let ps = ns.ps("home");
    while (ps.length > 1) {
        ps = ns.ps("home");
        await ns.sleep(1000);
    }

    ns.run(smartHackScriptPath, 1, target, ramEfficient);
}