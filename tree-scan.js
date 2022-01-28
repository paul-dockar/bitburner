/** @param {NS} ns **/
export function treeScan(ns) {
    let fromServers = ['home'];
    let checkedServers = [];
    let serverConnections = new Map();

    for (let i = 0; i < 10000; i++) {
        if (fromServers.length == 0) {
            break;
        }
        let server = fromServers.pop();
        checkedServers.push(server);
        serverConnections.set(server, []);
        for (let conServer of ns.scan(server)) {
            //if (conServer == ".") { continue; }
            serverConnections.get(server).push(conServer);
            if (!checkedServers.includes(conServer)) {
                fromServers.push(conServer);
            }
        }
    }
    checkedServers.shift(); // remove home
    return checkedServers;
}