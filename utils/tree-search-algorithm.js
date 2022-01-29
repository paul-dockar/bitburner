import { TreeNode } from '/classes/tree-node.js';

/** 
 * @param 	{NS} 		ns 
 * @return 	{Array<Object>}	TreeNode 
 */
export function treeSearchAlgorithm(ns) {
    let node = new TreeNode("home");
    let queue = [node.hostname];
    let visited = [];

    while (queue.length > 0) {
        node = new TreeNode(queue.shift());
        node.children = ns.scan(node.hostname);
        if (node.hostname != "home") {
            node.parent = node.children.shift();
        }

        visited.push(node);
        for (let child of node.children) {
            queue.push(child);
        }
    }

    return visited;
}