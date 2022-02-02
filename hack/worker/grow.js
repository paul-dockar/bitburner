/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const waitTime = ns.args[1];
    let enableLog;
    typeof ns.args[2] != "undefined" ? enableLog = ns.args[2] : enableLog = false;

    await ns.sleep(waitTime);

    const startTime = new Date(Date.now());
    const growth = await ns.grow(target);
    const finishTime = new Date(Date.now());

    if (enableLog) {
        const row = '| %6s | %-25s | %-25s | %-11s |';
        ns.tprintf(row, "GROW", startTime.toISOString(), finishTime.toISOString(), ns.nFormat(growth, '0%'));
    }
}