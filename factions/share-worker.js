/** @param {NS} ns **/
export async function main(ns) {
    while (true) {
        let promise = await ns.share();
        await ns.sleep(1000);
    }

}