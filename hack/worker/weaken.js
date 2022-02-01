/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const waitTime = ns.args[1];

    await ns.sleep(waitTime);

    const startTime = new Date(Date.now());
    const securityDecreased = await ns.weaken(target);
    const finishTime = new Date(Date.now());

    // const row = '| %4s | %-25s | %-25s | %-11s |';
    // ns.tprintf(row, "WEAK", startTime.toISOString(), finishTime.toISOString(), parseFloat(securityDecreased.toFixed(6)));
}