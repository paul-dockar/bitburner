/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const waitTime = ns.args[1];
    let enableLog;
    typeof ns.args[2] != "undefined" ? enableLog = ns.args[2] : enableLog = false;

    await ns.sleep(waitTime);

    const startTime = new Date(Date.now());
    const securityDecreased = await ns.weaken(target);
    const finishTime = new Date(Date.now());

    if (enableLog) {
        const row = '| %6s | %-25s | %-25s | %-11s |';
        ns.tprintf(row, "WEAK", startTime.toISOString(), finishTime.toISOString(), parseFloat(securityDecreased.toFixed(6)));
    }
}