/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const waitTime = ns.args[1];
    const scriptTime = ns.args[2];
    const maxScriptTime = ns.args[3];

    await ns.sleep(waitTime);
    const startTime = new Date(Date.now());

    let server = ns.getServer(target);
    let player = ns.getPlayer();
    let actualScriptTime = ns.formulas.hacking.growTime(server, player);
    const growth = await ns.grow(target);

    const finishTime = new Date(Date.now());
    const lag = Math.round((finishTime - startTime) - scriptTime, 2);


    const row = '%6s | %-26s | %-26s | %6s | %8s | %12s | %16s | %16s | %16s | %10s';
    ns.tprintf(row, "GROW", startTime.toISOString(), finishTime.toISOString(), lag, Math.round(waitTime, 3), "", Math.round(scriptTime, 2), Math.round(actualScriptTime, 2), maxScriptTime, ns.args[4]);
}