/** @param {NS} ns **/
export async function main(ns) {
    const target = ns.args[0];
    const waitTime = ns.args[1];

    await ns.sleep(waitTime);

    const startTime = new Date(Date.now());
    const growth = await ns.grow(target);
    const finishTime = new Date(Date.now());

    // const row = '| %4s | %-25s | %-25s | %-11s |';
    // ns.tprintf(row, "GROW", startTime.toISOString(), finishTime.toISOString(), ns.nFormat(growth, '0%'));
}